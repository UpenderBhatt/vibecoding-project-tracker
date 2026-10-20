import { getDueState } from '../data/dueState.js'
import { STATUSES, formatDate } from '../data/taskModel.js'

// M10 / FR19: turn a task into a Markdown briefing that reads naturally
// when pasted into Claude, ChatGPT, Cursor or any other AI chat.

function formatDateTime(iso) {
  const date = new Date(iso)
  return date.toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

// The task's own "## Background" etc. sit one level under "## Context"
function demoteHeadings(markdown) {
  return markdown.replace(/^(#{1,5})(\s)/gm, '#$1$2')
}

// Plain-English "when" for the due line, e.g. "in 3 days", "tomorrow", "overdue by 2 days"
function dueWhen(due) {
  switch (due.key) {
    case 'safe':
      return due.label.split(' · ')[1]
    case 'soon':
      return 'tomorrow'
    case 'warning':
      return 'today'
    case 'overdue':
      return due.label.toLowerCase()
    default:
      return 'already done'
  }
}

export function buildPromptContext(task, now = new Date()) {
  const status = STATUSES.find((s) => s.id === task.status)?.label ?? task.status
  const type = task.type === 'bug' ? 'Bug' : 'Feature'
  const due = getDueState(task, now)

  const details = [
    `- **Type:** ${type}`,
    `- **Status:** ${status}`,
    `- **Owner:** ${task.assignee}`,
  ]
  if (task.dueDate) details.push(`- **Due:** ${formatDate(task.dueDate)} (${dueWhen(due)})`)
  if (task.contextUpdatedAt) {
    details.push(
      `- **Context last updated:** ${formatDateTime(task.contextUpdatedAt)}` +
        (task.contextTool ? `, while working in ${task.contextTool}` : ''),
    )
  }

  const sections = [
    `# Task: ${task.title}`,
    "I'm picking up this task from our team's project board. Here's where it stands.",
    details.join('\n'),
  ]

  if (task.description?.trim()) {
    sections.push(`## Description\n\n${task.description.trim()}`)
  }

  sections.push(
    task.context?.trim()
      ? `## Context\n\n${demoteHeadings(task.context.trim())}`
      : '## Context\n\n_No context written yet._',
  )

  sections.push('Please read this briefing first, then help me continue from where it leaves off.')

  return sections.join('\n\n') + '\n'
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
