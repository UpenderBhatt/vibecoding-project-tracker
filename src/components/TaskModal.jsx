import { useEffect, useRef, useState } from 'react'
import { STATUSES, TASK_TYPES, formatDate } from '../data/taskModel.js'
import { TEAM } from '../data/team.js'

// Shared input styling (DESIGN.md: calm, 1px subtle border, brand focus ring)
const fieldClass =
  'w-full rounded-md border border-border-subtle bg-surface-page px-3 py-2 text-sm text-text-primary ' +
  'focus:outline-none focus:ring-2 focus:ring-brand-primary'
const labelClass = 'mb-1 block text-xs font-medium text-text-muted'
const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2'

const EMPTY_FORM = {
  title: '',
  description: '',
  type: 'feature',
  status: 'todo', // FR9: new tasks default to To Do
  assignee: TEAM[0],
  dueDate: '',
}

// FR6 (create) and FR10 (edit) share this modal. `task` is null when creating.
export default function TaskModal({ task, onSave, onDelete, onClose }) {
  const isEdit = Boolean(task)
  const [form, setForm] = useState(() => (task ? { ...task, dueDate: task.dueDate ?? '' } : EMPTY_FORM))
  const [error, setError] = useState('')
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const titleRef = useRef(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  // NFR7: the modal closes on Esc
  useEffect(() => {
    function handleKey(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
    if (field === 'title' && error) setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    // FR8: no saving without a title
    if (!form.title.trim()) {
      setError('Add a title to save this task.')
      titleRef.current?.focus()
      return
    }
    onSave({ ...form, title: form.title.trim(), dueDate: form.dueDate || null })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-modal-title"
        className="w-full max-w-md rounded-lg border border-border-subtle bg-surface-card p-6 shadow-lg"
      >
        <h2 id="task-modal-title" className="font-heading text-xl font-semibold text-brand-primary">
          {isEdit ? 'Edit task' : 'New task'}
        </h2>
        {isEdit && (
          <p className="mt-1 text-xs text-text-muted">Created {formatDate(task.createdDate)}</p>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
          <div>
            <label htmlFor="task-title" className={labelClass}>
              Title
            </label>
            <input
              id="task-title"
              ref={titleRef}
              type="text"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'task-title-error' : undefined}
              className={`${fieldClass} ${error ? 'border-due-warning' : ''}`}
            />
            {error && (
              <p id="task-title-error" className="mt-1 text-xs text-due-warning-text">
                {error}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="task-description" className={labelClass}>
              Description
            </label>
            <textarea
              id="task-description"
              rows={4}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              className={`${fieldClass} resize-y`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-type" className={labelClass}>
                Type
              </label>
              <select
                id="task-type"
                value={form.type}
                onChange={(e) => update('type', e.target.value)}
                className={fieldClass}
              >
                {TASK_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type === 'feature' ? 'Feature' : 'Bug'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="task-status" className={labelClass}>
                Status
              </label>
              <select
                id="task-status"
                value={form.status}
                onChange={(e) => update('status', e.target.value)}
                className={fieldClass}
              >
                {STATUSES.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="task-assignee" className={labelClass}>
                Assignee
              </label>
              <select
                id="task-assignee"
                value={form.assignee}
                onChange={(e) => update('assignee', e.target.value)}
                className={fieldClass}
              >
                {TEAM.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="task-due" className={labelClass}>
                Due date
              </label>
              <input
                id="task-due"
                type="date"
                value={form.dueDate}
                onChange={(e) => update('dueDate', e.target.value)}
                className={fieldClass}
              />
            </div>
          </div>

          {/* Footer: NFR4 — delete asks for confirmation first */}
          {confirmingDelete ? (
            <div className="flex items-center justify-between gap-3 rounded-md bg-due-warning-bg px-3 py-3">
              <p className="text-sm text-text-primary">Delete this task? There's no undo.</p>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(false)}
                  className={`rounded-md border border-border-subtle bg-surface-card px-3 py-1.5 text-sm text-text-primary ${focusRing}`}
                >
                  Keep it
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(task.id)}
                  className={`rounded-md bg-due-warning px-3 py-1.5 text-sm font-medium text-surface-page ${focusRing}`}
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between pt-2">
              {isEdit ? (
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  className={`rounded-md px-2 py-2 text-sm text-due-warning-text hover:bg-due-warning-bg ${focusRing}`}
                >
                  Delete task
                </button>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className={`rounded-md border border-brand-primary px-4 py-2 text-sm font-medium text-brand-primary hover:bg-brand-primary/5 ${focusRing}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-surface-page hover:bg-brand-primary/90 ${focusRing}`}
                >
                  {isEdit ? 'Save changes' : 'Add task'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
