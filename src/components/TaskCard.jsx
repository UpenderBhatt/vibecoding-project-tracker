import { formatDate } from '../data/taskModel.js'

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

export default function TaskCard({ task }) {
  return (
    <article className="rounded-lg border border-border-subtle bg-surface-card p-3 transition-shadow hover:shadow-sm">
      <span className={`font-mono text-[11px] uppercase tracking-wide ${TYPE_TEXT[task.type]}`}>
        {task.type}
      </span>

      <h3 className="mt-1 text-sm font-medium text-text-primary">{task.title}</h3>

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
