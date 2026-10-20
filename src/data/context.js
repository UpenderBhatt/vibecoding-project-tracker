// M9 task-context helpers

// Pre-filled into the Context field of new tasks (slide: Background / Constraints / Tried so far / Pick up).
export const CONTEXT_TEMPLATE = `## Background
-

## Constraints
-

## Tried so far
-

## Pick up
- `

// An untouched template counts as "no context", so it doesn't get saved or timestamped.
export function normalizeContext(text) {
  const trimmed = (text ?? '').trim()
  return trimmed === CONTEXT_TEMPLATE.trim() ? '' : (text ?? '')
}

// '2026-10-20T13:40:00.000Z' -> 'just now' / '5 min ago' / '2 h ago' / '3 days ago' / '12 Oct'
export function formatRelative(iso, now = new Date()) {
  if (!iso) return ''
  const then = new Date(iso)
  const minutes = Math.floor((now - then) / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} ${days === 1 ? 'day' : 'days'} ago`
  return then.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}
