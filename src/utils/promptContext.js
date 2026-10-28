// M10 / FR19: turn a task into a clean Markdown briefing for any AI chat.
// FR19: the task's title, type, description and full Context field — nothing else.

// The task's own "## Background" etc. sit one level under "## Context"
function demoteHeadings(markdown) {
  return markdown.replace(/^(#{1,5})(\s)/gm, '#$1$2')
}

export function buildPromptContext(task) {
  const parts = [`# ${task.title}`, `**Type:** ${task.type === 'bug' ? 'Bug' : 'Feature'}`]

  const description = task.description?.trim()
  if (description) parts.push(description)

  const context = task.context?.trim()
  if (context) parts.push(`## Context\n\n${demoteHeadings(context)}`)

  return parts.join('\n\n') + '\n'
}

// Copy text to the clipboard. Returns true if it worked.
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    // Fallback for browsers / contexts where the Clipboard API isn't allowed
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.setAttribute('readonly', '')
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(textarea)
      return ok
    } catch {
      return false
    }
  }
}
