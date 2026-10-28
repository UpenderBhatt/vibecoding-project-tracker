/*
  The only file the React app uses to talk to the backend.

  Today every call goes to the example backend in mockServer.js. To switch to a
  real server, replace the body of `request()` with the fetch() version shown
  below — the rest of the app stays exactly the same.
*/

import { handleRequest } from './mockServer.js'

const SESSION_KEY = 'vibeboard.session' // the browser only keeps the session token

export class ApiError extends Error {
  constructor(status, body) {
    super(body?.error ?? 'Something went wrong.')
    this.status = status
    this.fields = body?.fields ?? {}
  }
}

async function request(method, path, body) {
  const token = getSavedToken()

  // ── Real backend version ──
  // const res = await fetch(path, {
  //   method,
  //   headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
  //   body: body ? JSON.stringify(body) : undefined,
  // })
  // const data = res.status === 204 ? null : await res.json()
  // if (!res.ok) throw new ApiError(res.status, data)
  // return data

  // ── Example backend version (prototype) ──
  const res = await handleRequest(method, path, { body, token })
  if (res.status >= 400) throw new ApiError(res.status, res.body)
  return res.body
}

// ─── Session token ───────────────────────────────────────────────────────────

export function getSavedToken() {
  try {
    return localStorage.getItem(SESSION_KEY)
  } catch {
    return null
  }
}

function saveToken(token) {
  if (token) localStorage.setItem(SESSION_KEY, token)
  else localStorage.removeItem(SESSION_KEY)
}

// ─── API calls ───────────────────────────────────────────────────────────────

// FR26
export async function signUp({ name, email, password }) {
  const { user, token } = await request('POST', '/api/auth/signup', { name, email, password })
  saveToken(token)
  return user
}

// FR27
export async function logIn({ email, password }) {
  const { user, token } = await request('POST', '/api/auth/login', { email, password })
  saveToken(token)
  return user
}

// FR28
export async function logOut() {
  try {
    await request('POST', '/api/auth/logout')
  } finally {
    saveToken(null)
  }
}

// Who is logged in right now (null if nobody, or the session has ended)
export async function getCurrentUser() {
  if (!getSavedToken()) return null
  try {
    const { user } = await request('GET', '/api/me')
    return user
  } catch (err) {
    if (err.status === 401) saveToken(null)
    return null
  }
}

// FR29: the logged-in user's tasks, team and links
export async function loadBoard() {
  return request('GET', '/api/board')
}

// FR23: save the whole board after every change
export async function saveBoard(board) {
  await request('PUT', '/api/board', { board })
}
