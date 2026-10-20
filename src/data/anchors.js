/*
  Anchor = {
    id: 'presentation' | 'demo' | 'report' | 'documentation',
    label: string,
    url: string | null,
  }
*/

// The four fixed deliverable slots, in display order (FR20).
export const ANCHOR_SLOTS = [
  { id: 'presentation', label: 'Presentation' },
  { id: 'demo', label: 'Demo' },
  { id: 'report', label: 'Report' },
  { id: 'documentation', label: 'Documentation' },
]

export function createAnchors() {
  return ANCHOR_SLOTS.map((slot) => ({ ...slot, url: null }))
}

// Always return exactly the four slots, in order, keeping any saved URLs.
export function parseAnchors(saved) {
  const list = Array.isArray(saved) ? saved : []
  return ANCHOR_SLOTS.map((slot) => {
    const found = list.find((a) => a?.id === slot.id)
    return { ...slot, url: typeof found?.url === 'string' && found.url ? found.url : null }
  })
}

// Turn whatever was typed into a safe http(s) link.
// "alpha.project.demo" -> "https://alpha.project.demo"
// Returns { url } or { error }.
export function normaliseUrl(input) {
  const text = input.trim()
  if (!text) return { url: null }

  const withScheme = /^[a-z][a-z\d+.-]*:/i.test(text) ? text : `https://${text}`
  try {
    const parsed = new URL(withScheme)
    // Only web links — blocks javascript: and other unsafe schemes
    if (!['http:', 'https:'].includes(parsed.protocol) || !parsed.hostname.includes('.')) {
      throw new Error('not a web link')
    }
    return { url: parsed.href }
  } catch {
    return { error: "That doesn't look like a link." }
  }
}

// "https://docs.google.com/presentation/d/abc" -> "docs.google.com"
export function displayHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}
