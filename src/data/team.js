// FR15: team members belong to an account and are added in the app.
//
// TeamMember = { id: string, name: string }

const MAX_NAME_LENGTH = 40

function newId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now() + Math.random())
}

export function createMember(name) {
  return { id: newId(), name: name.trim() }
}

// Returns an error message, or '' if the name is fine.
export function validateMemberName(name, team) {
  const clean = name.trim()
  if (!clean) return 'Add a name first.'
  if (clean.length > MAX_NAME_LENGTH) return `Keep names under ${MAX_NAME_LENGTH} characters.`
  const existing = team.find((m) => m.name.toLowerCase() === clean.toLowerCase())
  if (existing) return `${existing.name} is already on the team.`
  return ''
}

// Clean up a saved team list; drops anything that isn't a named member and any duplicates.
export function parseTeam(saved) {
  const list = Array.isArray(saved) ? saved : []
  const seen = new Set()
  return list
    .filter((m) => typeof m?.name === 'string' && m.name.trim())
    .map((m) => ({ id: typeof m.id === 'string' ? m.id : newId(), name: m.name.trim() }))
    .filter((m) => {
      const key = m.name.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
}
