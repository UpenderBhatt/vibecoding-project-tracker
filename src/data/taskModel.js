/*
  Task = {
    id: string,
    title: string,
    description: string,
    type: 'feature' | 'bug',
    status: 'todo' | 'in-progress' | 'review' | 'done',
    assignee: string,              // a team member's name (FR15)
    dueDate: string | null,        // 'YYYY-MM-DD'
    createdDate: string,           // 'YYYY-MM-DD'
    context: string,               // M9
    contextTool: string | null,    // M9
    contextUpdatedAt: string|null, // M9
  }
*/

// Board columns, in display order (FR1).
export const STATUSES = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'done', label: 'Done' },
]

export const TASK_TYPES = ['feature', 'bug']

// FR25: the AI tools offered in the dropdown
export const CONTEXT_TOOLS = ['ChatGPT', 'Claude', 'Copilot', 'Other']

const STATUS_IDS = STATUSES.map((s) => s.id)

// --- Date helpers (dates are stored as 'YYYY-MM-DD' in local time) ---

function toISODate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function todayISO() {
  return toISODate(new Date())
}

export function addDaysISO(days) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return toISODate(date)
}

// '2026-10-21' -> '21 Oct'
export function formatDate(iso) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function newId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now() + Math.random())
}

// Build a valid Task, filling defaults for anything missing.
// Also used on load, so tasks saved by older versions still work.
export function createTask(fields = {}) {
  return {
    id: fields.id ?? newId(),
    title: (fields.title ?? '').trim(),
    description: fields.description ?? '',
    type: TASK_TYPES.includes(fields.type) ? fields.type : 'feature',
    status: STATUS_IDS.includes(fields.status) ? fields.status : 'todo',
    assignee: typeof fields.assignee === 'string' ? fields.assignee : '',
    dueDate: fields.dueDate ?? null,
    createdDate: fields.createdDate ?? todayISO(),
    context: fields.context ?? '',
    contextTool: fields.contextTool ?? null,
    contextUpdatedAt: fields.contextUpdatedAt ?? null,
  }
}

// Example tasks for a new account, so the board isn't empty and shows how it works.
// Their due dates land in different tint states (FR16).
export function seedTasks(ownerName) {
  return [
    createTask({
      title: 'Add your teammates',
      description: 'Use "+ Add member" above the board. New people show up in every assignee list.',
      type: 'feature',
      status: 'todo',
      assignee: ownerName,
      dueDate: addDaysISO(4),
    }),
    createTask({
      title: 'Drag this card to In Progress',
      description: 'Drag cards between columns, or use the status dropdown on the card.',
      type: 'feature',
      status: 'todo',
      assignee: ownerName,
      dueDate: addDaysISO(1),
    }),
    createTask({
      title: 'Copy this task into your AI chat',
      description: 'Press Copy Context, then paste into ChatGPT, Claude or Copilot.',
      type: 'feature',
      status: 'in-progress',
      assignee: ownerName,
      dueDate: addDaysISO(0),
      context:
        '## Background\n- Vibe Board keeps the prompt context with each task\n\n## Pick up\n- Paste this into an AI chat and ask it to continue',
      contextTool: 'Claude',
      contextUpdatedAt: new Date().toISOString(),
    }),
    createTask({
      title: 'Example bug: header overlaps on small screens',
      description: 'Shows what an overdue bug looks like.',
      type: 'bug',
      status: 'review',
      assignee: ownerName,
      dueDate: addDaysISO(-1),
    }),
  ]
}
