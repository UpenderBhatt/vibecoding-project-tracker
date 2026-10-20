// M9 stretch: a tiny Markdown renderer for the Context preview.
// Supports: # / ## / ### headings, **bold**, *italic*, `code`, ``` code blocks,
// - bullet lists, 1. numbered lists and paragraphs.
//
// Safe by design: ALL text is HTML-escaped first, and only the fixed tags below
// are ever added, so nothing typed into the field can inject HTML or scripts.

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Inline formatting on an already-escaped line
function inline(text) {
  const parts = text.split('`')
  // An unmatched backtick is just a backtick
  if (parts.length % 2 === 0) parts.splice(-2, 2, parts.slice(-2).join('`'))
  return parts
    .map((part, i) =>
      i % 2 === 1
        ? `<code>${part}</code>`
        : part
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/(^|[^*\w])\*(?!\s)(.+?)(?<!\s)\*(?!\*)/g, '$1<em>$2</em>'),
    )
    .join('')
}

export function renderMarkdown(source) {
  const lines = escapeHtml(source ?? '').split('\n')
  const html = []
  let list = null // 'ul' | 'ol'
  let paragraph = []
  let inCode = false
  let code = []

  const closeParagraph = () => {
    if (paragraph.length) html.push(`<p>${inline(paragraph.join(' '))}</p>`)
    paragraph = []
  }
  const closeList = () => {
    if (list) html.push(`</${list}>`)
    list = null
  }
  const openList = (kind) => {
    if (list !== kind) {
      closeList()
      html.push(`<${kind}>`)
      list = kind
    }
  }

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      if (inCode) {
        html.push(`<pre><code>${code.join('\n')}</code></pre>`)
        code = []
        inCode = false
      } else {
        closeParagraph()
        closeList()
        inCode = true
      }
      continue
    }
    if (inCode) {
      code.push(line)
      continue
    }

    const heading = line.match(/^(#{1,3})\s+(.*)$/)
    const bullet = line.match(/^\s*[-*+]\s+(.*)$/) || line.match(/^\s*[-*+]$/)
    const numbered = line.match(/^\s*\d+[.)]\s+(.*)$/)

    if (heading) {
      closeParagraph()
      closeList()
      const level = heading[1].length
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`)
    } else if (bullet) {
      closeParagraph()
      openList('ul')
      html.push(`<li>${inline(bullet[1] ?? '')}</li>`)
    } else if (numbered) {
      closeParagraph()
      openList('ol')
      html.push(`<li>${inline(numbered[1])}</li>`)
    } else if (line.trim() === '') {
      closeParagraph()
      closeList()
    } else {
      closeList()
      paragraph.push(line.trim())
    }
  }

  if (inCode) html.push(`<pre><code>${code.join('\n')}</code></pre>`)
  closeParagraph()
  closeList()
  return html.join('\n')
}
