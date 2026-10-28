import { useState } from 'react'
import { validateMemberName } from '../data/team.js'
import Avatar from './Avatar.jsx'

const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2'

// FR15: add a team member. They then appear in the assignee dropdown and on each card.
function AddMember({ team, onAdd }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  function close() {
    setOpen(false)
    setName('')
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const problem = validateMemberName(name, team)
    if (problem) {
      setError(problem)
      return
    }
    setBusy(true)
    const ok = await onAdd(name.trim())
    setBusy(false)
    if (ok) close()
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`flex min-h-[4.25rem] items-center justify-center gap-2 rounded-lg border border-dashed border-border-subtle px-4 py-3 text-sm font-medium text-brand-primary hover:border-brand-primary hover:bg-brand-primary/5 ${focusRing}`}
      >
        + Add member
      </button>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={(e) => e.key === 'Escape' && close()}
      noValidate
      className="rounded-lg border border-brand-primary/40 bg-surface-card px-3 py-2.5"
    >
      <label htmlFor="new-member" className="mb-1 block text-xs font-medium text-text-muted">
        New team member
      </label>
      <div className="flex gap-2">
        <input
          id="new-member"
          autoFocus
          value={name}
          placeholder="Their name"
          onChange={(e) => {
            setName(e.target.value)
            if (error) setError('')
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'new-member-error' : undefined}
          className={`min-w-0 flex-1 rounded-md border bg-surface-page px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary ${
            error ? 'border-due-warning' : 'border-border-subtle'
          }`}
        />
        <button
          type="submit"
          disabled={busy}
          className={`rounded-md bg-brand-primary px-3 py-1.5 text-sm font-medium text-surface-page disabled:opacity-60 ${focusRing}`}
        >
          Add
        </button>
        <button
          type="button"
          onClick={close}
          className={`rounded-md px-2 py-1.5 text-sm text-text-muted hover:text-text-primary ${focusRing}`}
        >
          Cancel
        </button>
      </div>
      {error && (
        <p id="new-member-error" className="mt-1 text-xs text-due-warning-text">
          {error}
        </p>
      )}
    </form>
  )
}

// Who's on the team, and what each person is currently driving
export default function TeamStrip({ team, tasks, onAddMember }) {
  return (
    <section aria-labelledby="team-heading" className="mb-6">
      <h2
        id="team-heading"
        className="mb-2 text-[13px] font-semibold uppercase tracking-wide text-text-primary"
      >
        Team
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        {team.map(({ id, name }) => {
          const open = tasks.filter((t) => t.assignee === name && t.status !== 'done')
          const driving = open.filter((t) => t.status === 'in-progress')

          return (
            <div
              key={id}
              className="flex items-center gap-3 rounded-lg border border-border-subtle bg-surface-card px-4 py-3"
            >
              <Avatar name={name} size="lg" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-text-primary">
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
        <AddMember team={team} onAdd={onAddMember} />
      </div>
    </section>
  )
}
