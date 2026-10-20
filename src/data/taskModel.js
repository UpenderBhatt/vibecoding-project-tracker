import { TEAM } from './team.js'

/*
  Task = {
    id: string,
    title: string,
    description: string,
    type: 'feature' | 'bug',
    status: 'todo' | 'in-progress' | 'review' | 'done',
    assignee: string,              // one of TEAM
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

export const CONTEXT_TOOLS = ['Claude', 'ChatGPT', 'Cursor', 'Lovable', 'Replit', 'Other']

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
    assignee: TEAM.includes(fields.assignee) ? fields.assignee : TEAM[0],
    dueDate: fields.dueDate ?? null,
    createdDate: fields.createdDate ?? todayISO(),
    context: fields.context ?? '',
    contextTool: fields.contextTool ?? null,
    contextUpdatedAt: fields.contextUpdatedAt ?? null,
  }
}

// Mock tasks so the board isn't empty on first load.
export function seedTasks() {
  return [
    createTask({
      title: 'Set up Vite + Tailwind with design tokens',
      description: 'Paste the DESIGN.md palette and fonts into tailwind.config.js.',
      type: 'feature',
      status: 'done',
      assignee: TEAM[1],
      dueDate: addDaysISO(-1),
    }),
    createTask({
      title: 'Build the four-column board',
      description: 'Task model, columns and cards for M4.',
      type: 'feature',
      status: 'in-progress',
      assignee: TEAM[0],
      dueDate: addDaysISO(0),
    }),
    createTask({
      title: 'Draft the Copy as Prompt Context template',
      description: 'Markdown layout for the M10 copy button.',
      type: 'feature',
      status: 'todo',
      assignee: TEAM[2],
      dueDate: addDaysISO(3),
    }),
    createTask({
      title: 'Fonts flash before loading',
      description: 'Headings render in Georgia for a moment on first load.',
      type: 'bug',
      status: 'review',
      assignee: TEAM[1],
      dueDate: addDaysISO(1),
    }),
  ]
}
