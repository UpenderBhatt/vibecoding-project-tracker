import { TEAM } from '../data/team.js'
import Avatar from './Avatar.jsx'

// M7 (optional): a strip showing what each teammate is currently driving.
export default function TeamStrip({ tasks }) {
  return (
    <section aria-label="Who's on what" className="mb-6 grid grid-cols-3 gap-4">
      {TEAM.map((name) => {
        const open = tasks.filter((t) => t.assignee === name && t.status !== 'done')
        const driving = open.filter((t) => t.status === 'in-progress')

        return (
          <div
            key={name}
            className="flex items-center gap-3 rounded-lg border border-border-subtle bg-surface-card px-4 py-3"
          >
            <Avatar name={name} size="lg" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-text-primary">
                {name}
                <span className="font-normal text-text-muted"> · {open.length} open</span>
              </p>
              <p className="truncate text-xs text-text-muted">
                {driving.length > 0
                  ? `Driving: ${driving.map((t) => t.title).join(', ')}`
                  : 'Nothing in progress'}
              </p>
            </div>
          </div>
        )
      })}
    </section>
  )
}
