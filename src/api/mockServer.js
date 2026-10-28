/*
  ─────────────────────────────────────────────────────────────────────────────
  EXAMPLE BACKEND (prototype)

  This file plays the part of the server. It answers HTTP-style requests
  (method + path + JSON body + bearer token) exactly the way a real API would,
  but it runs inside the browser and keeps its "database" in localStorage.

  In a real deployment this whole file would live on a server (e.g. Node +
  Express + PostgreSQL, or Supabase), and src/api/client.js would call it with
  fetch() instead of handleRequest(). Nothing in the React components would
  need to change. See BACKEND.md for the full explanation.

  Routes:
    POST /api/auth/signup   { name, email, password } -> 201 { user, token }   FR26
    POST /api/auth/login    { email, password }       -> 200 { user, token }   FR27
    POST /api/auth/logout                             -> 204                   FR28
    GET  /api/me                                      -> 200 { user }
    GET  /api/board                                   -> 200 { board, recovered }  FR29
    PUT  /api/board         { board }                 -> 200 { ok: true }          FR23, FR29

  "Database" tables (localStorage keys):
    vibeboard.server.users          User[]  (passwords stored hashed — NFR10)
    vibeboard.server.sessions       { [token]: { userId, createdAt } }
    vibeboard.server.board.<userId> Board   (one per account — FR29 / NFR11)
  ─────────────────────────────────────────────────────────────────────────────
*/

import { createBoard, parseBoard } from '../data/board.js'
import { createMember } from '../data/team.js'

const USERS_KEY = 'vibeboard.server.users'
const SESSIONS_KEY = 'vibeboard.server.sessions'
const boardKey = (userId) => `vibeboard.server.board.${userId}`

// Data saved by the version of the app before accounts existed (M4–M11)
const LEGACY_TASKS_KEY = 'vibeboard.tasks'
const LEGACY_ANCHORS_KEY = 'vibeboard.anchors'
const LEGACY_IMPORTED_KEY = 'vibeboard.server.legacyImported'

// Pretend network delay, so loading states behave like they would against a real server
const AUTH_DELAY_MS = 300
const BOARD_DELAY_MS = 40

// NFR10: password hashing settings (PBKDF2-SHA256 with a random salt per user)
const HASH_ITERATIONS = 100000

// ─── "Database" helpers ──────────────────────────────────────────────────────

function readJson(key, fallback) {
  const raw = localStorage.getItem(key)
  if (raw === null) return fallback
  return JSON.parse(raw)
}

// localStorage.setItem either writes everything or throws (e.g. storage full),
// so a failed write never leaves half-saved data behind (NFR9).
function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

const getUsers = () => readJson(USERS_KEY, [])
const getSessions = () => readJson(SESSIONS_KEY, {})

function newId() {
  return crypto.randomUUID()
}

function newToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  return toHex(bytes)
}

// Only these fields ever leave the "server" — never the password hash (NFR12)
function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email }
}

// ─── Password hashing (NFR10) ────────────────────────────────────────────────
// A real server would use bcrypt or Argon2. Web Crypto's PBKDF2 is the closest
// built-in equivalent in the browser and follows the same idea: salt + slow hash.

function toHex(bytes) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

function fromHex(hex) {
  return new Uint8Array(hex.match(/.{2}/g).map((h) => parseInt(h, 16)))
}

async function hashPassword(password, saltHex = toHex(crypto.getRandomValues(new Uint8Array(16)))) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, [
    'deriveBits',
  ])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt: fromHex(saltHex), iterations: HASH_ITERATIONS },
    key,
    256,
  )
  return { hash: toHex(new Uint8Array(bits)), salt: saltHex, iterations: HASH_ITERATIONS }
}

// Compare every character so the time taken doesn't reveal how much matched
function safeEqual(a, b) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

// ─── Validation ──────────────────────────────────────────────────────────────

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateSignUp({ name, email, password }) {
  const errors = {}
  if (!name?.trim()) errors.name = 'Add your name.'
  else if (name.trim().length > 60) errors.name = 'Keep your name under 60 characters.'
  if (!EMAIL_PATTERN.test(email?.trim() ?? '')) errors.email = 'Enter a valid email address.'
  if ((password ?? '').length < 8) errors.password = 'Use at least 8 characters.'
  return errors
}

// ─── Auth ────────────────────────────────────────────────────────────────────

// Works out who is making the request from their bearer token.
// Every board route goes through this, so nobody can reach another account's data (NFR11).
function authenticate(token) {
  if (!token) return null
  const session = getSessions()[token]
  if (!session) return null
  return getUsers().find((u) => u.id === session.userId) ?? null
}

function startSession(userId) {
  const token = newToken()
  const sessions = getSessions()
  sessions[token] = { userId, createdAt: new Date().toISOString() }
  writeJson(SESSIONS_KEY, sessions)
  return token
}

// Moves tasks and links made before accounts existed into the first account created
// in this browser, so nobody's existing board is lost when they upgrade.
function importLegacyBoard(user) {
  if (localStorage.getItem(LEGACY_IMPORTED_KEY)) return null
  const rawTasks = localStorage.getItem(LEGACY_TASKS_KEY)
  const rawAnchors = localStorage.getItem(LEGACY_ANCHORS_KEY)
  if (rawTasks === null && rawAnchors === null) return null

  try {
    const board = parseBoard({
      tasks: rawTasks ? JSON.parse(rawTasks) : [],
      anchors: rawAnchors ? JSON.parse(rawAnchors) : [],
    })
    const names = [user.name, ...board.tasks.map((t) => t.assignee)].filter(Boolean)
    const unique = [...new Map(names.map((n) => [n.toLowerCase(), n])).values()]
    board.team = unique.map(createMember)
    localStorage.setItem(LEGACY_IMPORTED_KEY, user.id)
    return board
  } catch {
    return null
  }
}

async function signUp(body) {
  const errors = validateSignUp(body)
  if (Object.keys(errors).length)
    return { status: 400, body: { error: 'Check the highlighted fields.', fields: errors } }

  const email = body.email.trim().toLowerCase()
  const users = getUsers()
  if (users.some((u) => u.email === email)) {
    return {
      status: 409,
      body: {
        error: 'An account with that email already exists.',
        fields: { email: 'Already registered — try logging in.' },
      },
    }
  }

  // NFR12: only name, email and password are collected
  const { hash, salt, iterations } = await hashPassword(body.password)
  const user = {
    id: newId(),
    name: body.name.trim(),
    email,
    passwordHash: hash,
    passwordSalt: salt,
    passwordIterations: iterations,
    createdAt: new Date().toISOString(),
  }

  writeJson(USERS_KEY, [...users, user])
  writeJson(boardKey(user.id), importLegacyBoard(user) ?? createBoard(user.name))
  const token = startSession(user.id)
  return { status: 201, body: { user: publicUser(user), token } }
}

async function logIn(body) {
  const email = (body.email ?? '').trim().toLowerCase()
  const user = getUsers().find((u) => u.email === email)

  // Same message whether the email or the password was wrong, so emails can't be guessed
  const failed = { status: 401, body: { error: "That email and password don't match." } }
  if (!user) {
    await hashPassword(body.password ?? '') // keep the timing similar either way
    return failed
  }

  const { hash } = await hashPassword(body.password ?? '', user.passwordSalt)
  if (!safeEqual(hash, user.passwordHash)) return failed

  const token = startSession(user.id)
  return { status: 200, body: { user: publicUser(user), token } }
}

function logOut(token) {
  const sessions = getSessions()
  delete sessions[token]
  writeJson(SESSIONS_KEY, sessions)
  return { status: 204, body: null }
}

// ─── Board (FR23, FR29) ──────────────────────────────────────────────────────

function getBoard(user) {
  const key = boardKey(user.id)
  const raw = localStorage.getItem(key)
  if (raw === null) return { status: 200, body: { board: createBoard(user.name), recovered: false } }

  try {
    return { status: 200, body: { board: parseBoard(JSON.parse(raw)), recovered: false } }
  } catch {
    // NFR9: saved data can't be read — keep a copy rather than throwing it away
    localStorage.setItem(`${key}.backup-${Date.now()}`, raw)
    return { status: 200, body: { board: createBoard(user.name), recovered: true } }
  }
}

function saveBoard(user, body) {
  // Demo switch for NFR9: add ?fail-saves to the page URL to see how a failed save is handled
  if (new URLSearchParams(window.location.search).has('fail-saves')) {
    return { status: 500, body: { error: 'Simulated storage failure.' } }
  }
  if (!body?.board) return { status: 400, body: { error: 'No board sent.' } }

  try {
    // The board is always saved under the logged-in user's id — never one taken from the request
    writeJson(boardKey(user.id), parseBoard(body.board))
    return { status: 200, body: { ok: true } }
  } catch {
    return { status: 507, body: { error: 'Storage is full.' } }
  }
}

// ─── Router ──────────────────────────────────────────────────────────────────

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Handle one request, the way an HTTP server would.
 * @returns {Promise<{ status: number, body: any }>}
 */
export async function handleRequest(method, path, { body, token } = {}) {
  const route = `${method} ${path}`
  await wait(route.startsWith('POST /api/auth') ? AUTH_DELAY_MS : BOARD_DELAY_MS)

  try {
    if (route === 'POST /api/auth/signup') return await signUp(body ?? {})
    if (route === 'POST /api/auth/login') return await logIn(body ?? {})

    // Everything below needs a logged-in user
    const user = authenticate(token)
    if (!user) return { status: 401, body: { error: 'Please log in again.' } }

    if (route === 'POST /api/auth/logout') return logOut(token)
    if (route === 'GET /api/me') return { status: 200, body: { user: publicUser(user) } }
    if (route === 'GET /api/board') return getBoard(user)
    if (route === 'PUT /api/board') return saveBoard(user, body)

    return { status: 404, body: { error: 'Not found.' } }
  } catch (err) {
    console.error(err)
    return { status: 500, body: { error: 'Something went wrong on the server.' } }
  }
}
