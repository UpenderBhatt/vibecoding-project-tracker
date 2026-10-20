import { STATUSES, formatDate } from '../data/taskModel.js'

function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const TYPE_TEXT = {
  feature: 'text-type-feature',
  bug: 'text-type-bug',
}

export default function TaskCard({ task, onOpen, onStatusChange }) {
  return (
    <article className="relative rounded-lg border border-border-subtle bg-surface-card p-3 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <span className={`font-mono text-[11px] uppercase tracking-wide ${TYPE_TEXT[task.type]}`}>
          {task.type}
        </span>

        {/* FR12: status dropdown on the card moves it to the matching column */}
        <select
          aria-label={`Status of ${task.title}`}
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          className="relative z-10 rounded-md border border-border-subtle bg-surface-page px-1.5 py-0.5 text-[11px] text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary"
        >
          {STATUSES.map((status) => (
            <option key={status.id} value={status.id}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {/* FR10: clicking the card opens it for editing. The ::after overlay makes the
          whole card clickable while keeping a real, keyboard-focusable button (NFR7). */}
      <h3 className="mt-1 text-sm font-medium text-text-primary">
        <button
          type="button"
          onClick={() => onOpen(task.id)}
          className="text-left after:absolute after:inset-0 after:rounded-lg focus:outline-none focus-visible:after:ring-2 focus-visible:after:ring-brand-primary"
        >
          {task.title}
        </button>
      </h3>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            aria-hidden="true"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-primary text-[10px] font-semibold text-surface-page"
          >
            {initials(task.assignee)}
          </span>
          <span className="truncate text-xs text-text-primary">{task.assignee}</span>
        </div>

        {task.dueDate && (
          <time dateTime={task.dueDate} className="shrink-0 text-xs text-text-muted">
            Due {formatDate(task.dueDate)}
          </time>
        )}
      </div>
    </article>
  )
}
