import { formatDate } from './taskModel.js'

const HOUR = 60 * 60 * 1000

// M8 / FR16: work out a task's due state from its existing dueDate — no new fields.
// A task counts as due at the END of its due day (23:59 local time).
//
//   done (any date)      -> 'neutral'  (overrides everything, even if it was overdue)
//   past due             -> 'overdue'  (blue)
//   less than 24 hours   -> 'warning'  (red)
//   24 hours to 2 days   -> 'soon'     (yellow)
//   more than 2 days     -> 'safe'     (green)
//
// Returns null when the task has no due date.
export function getDueState(task, now = new Date()) {
  if (!task.dueDate) return null

  if (task.status === 'done') {
    return { key: 'neutral', label: `Done · was due ${formatDate(task.dueDate)}` }
  }

  const [y, m, d] = task.dueDate.split('-').map(Number)
  const dueEnd = new Date(y, m - 1, d, 23, 59, 59, 999)
  const hoursLeft = (dueEnd - now) / HOUR

  if (hoursLeft < 0) {
    const days = Math.ceil(-hoursLeft / 24)
    return { key: 'overdue', label: `Overdue by ${days} ${days === 1 ? 'day' : 'days'}` }
  }
  if (hoursLeft < 24) return { key: 'warning', label: 'Due today' }
  if (hoursLeft < 48) return { key: 'soon', label: 'Due tomorrow' }

  const days = Math.floor(hoursLeft / 24)
  return { key: 'safe', label: `Due ${formatDate(task.dueDate)} · in ${days} days` }
}
