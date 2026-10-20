import { getDueState } from '../data/dueState.js'
import { STATUSES } from '../data/taskModel.js'
import { TEAM } from '../data/team.js'
import Avatar from './Avatar.jsx'
import DueBadge, { DUE_STYLES } from './DueBadge.jsx'
import TypeBadge, { TYPE_STYLES } from './TypeBadge.jsx'

const smallSelect =
  'relative z-10 rounded-md border border-border-subtle bg-surface-page px-1.5 py-0.5 text-[11px] text-text-muted ' +
  'focus:outline-none focus:ring-2 focus:ring-brand-primary'

export default function TaskCard({ task, now, onOpen, onStatusChange, onHandOff }) {
  // FR16 (M8): tint the card by how soon it's due; no due date = no tint
  const due = getDueState(task, now)
  const tint = due ? DUE_STYLES[due.key].card : 'bg-surface-card border-border-subtle'

  return (
    // FR13 / DESIGN.md §4: 3px left stripe in the type colour
    <article
      className={`relative rounded-lg border border-l-[3px] ${tint} ${TYPE_STYLES[task.type].stripe} p-3 transition-shadow hover:shadow-sm`}
    >
      <div className="flex items-center justify-between gap-2">
        {/* FR13 / NFR6: icon + label in the corner, not colour alone */}
        <TypeBadge type={task.type} />

        {/* FR12: status dropdown on the card moves it to the matching column */}
        <select
          aria-label={`Status of ${task.title}`}
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          className={smallSelect}
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

      {/* NFR6: due state shown with an icon and words, not just the tint */}
      {due && (
        <div className="mt-1.5">
          <DueBadge state={due} dueDate={task.dueDate} />
        </div>
      )}

      {/* FR14: whose task it is, at a glance. FR15: hand off from one dropdown. */}
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-border-subtle pt-2">
        <div className="flex min-w-0 items-center gap-2">
          <Avatar name={task.assignee} size="md" />
          <span className="truncate text-xs font-medium text-text-primary">{task.assignee}</span>
        </div>

        <select
          aria-label={`Hand off ${task.title} to`}
          value=""
          onChange={(e) => e.target.value && onHandOff(task.id, e.target.value)}
          className={smallSelect}
        >
          <option value="" disabled>
            Hand off to…
          </option>
          {TEAM.filter((name) => name !== task.assignee).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
    </article>
  )
}
