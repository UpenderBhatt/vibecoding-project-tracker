import { useCallback, useEffect, useRef, useState } from 'react'
import { loadBoard, saveBoard } from '../api/client.js'
import { STATUSES, createTask } from '../data/taskModel.js'
import { createMember } from '../data/team.js'
import { useNow } from '../hooks/useNow.js'
import { buildPromptContext, copyToClipboard } from '../utils/promptContext.js'
import AnchorBoard from './AnchorBoard.jsx'
import { TeamContext } from './Avatar.jsx'
import Board from './Board.jsx'
import TaskModal from './TaskModal.jsx'
import TeamStrip from './TeamStrip.jsx'

const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2'

// DESIGN.md §5 handoff microcopy
const handOffMessage = (name) => `Passed to ${name}. It's on their page now.`
const SAVE_FAILED = "Couldn't save that. Your board is as you last saved it."

export default function BoardPage({ user, notify, onLogOut, onSessionExpired }) {
  // FR29: this account's tasks, team and links, loaded from the backend
  const [board, setBoard] = useState(null)
  const [loadError, setLoadError] = useState(false)
  const boardRef = useRef(null) // always the latest board, for back-to-back changes

  const now = useNow() // M8: ticks every minute so due colours update by themselves

  // null = closed, { mode: 'create' } or { mode: 'edit', taskId }
  const [modal, setModal] = useState(null)
  const closeModal = useCallback(() => setModal(null), [])

  const showBoard = useCallback((next) => {
    boardRef.current = next
    setBoard(next)
  }, [])

  const fetchBoard = useCallback(async () => {
    setLoadError(false)
    try {
      const { board: saved, recovered } = await loadBoard()
      showBoard(saved)
      // NFR9: unreadable data was kept as a backup rather than lost
      if (recovered)
        notify("We couldn't read your saved board, so we kept a backup copy and started fresh.", 'error')
    } catch (err) {
      if (err.status === 401) onSessionExpired()
      else setLoadError(true)
    }
  }, [notify, onSessionExpired, showBoard])

  useEffect(() => {
    fetchBoard()
  }, [fetchBoard])

  /*
    Every change goes through here (FR23):
      1. show it straight away, so the board feels instant (NFR2)
      2. save it to the backend
      3. confirm with a message (NFR8) — or, if the save fails, say so and put the
         board back to what is actually saved, so nothing saved is lost (NFR9)
    Returns true if the change was saved.
  */
  async function update(change, successMessage) {
    const next = change(boardRef.current)
    showBoard(next)
    try {
      await saveBoard(next)
      if (successMessage) notify(successMessage)
      return true
    } catch (err) {
      if (err.status === 401) {
        onSessionExpired()
        return false
      }
      notify(SAVE_FAILED, 'error')
      try {
        const { board: saved } = await loadBoard()
        showBoard(saved)
      } catch {
        // Keep what's on screen if the backend can't be reached at all
      }
      return false
    }
  }

  const updateTasks = (fn) => (b) => ({ ...b, tasks: fn(b.tasks) })

  // FR6 / FR7 / FR10: create or update a task from the modal. The modal stays open if the save fails.
  async function saveTask(fields) {
    if (modal?.mode === 'edit') {
      const before = boardRef.current.tasks.find((t) => t.id === modal.taskId)
      const message =
        before && fields.assignee !== before.assignee ? handOffMessage(fields.assignee) : 'Changes saved.'
      const ok = await update(
        updateTasks((tasks) =>
          tasks.map((t) => (t.id === modal.taskId ? createTask({ ...t, ...fields }) : t)),
        ),
        message,
      )
      if (ok) setModal(null)
    } else {
      const ok = await update(
        updateTasks((tasks) => [...tasks, createTask(fields)]),
        'Task added.',
      )
      if (ok) setModal(null)
    }
  }

  // FR11: delete (the modal asks for confirmation first — NFR4)
  async function deleteTask(id) {
    const ok = await update(
      updateTasks((tasks) => tasks.filter((t) => t.id !== id)),
      'Task deleted.',
    )
    if (ok) setModal(null)
  }

  // FR12 (status dropdown) and FR14 (drag and drop)
  function changeStatus(id, status) {
    const task = boardRef.current.tasks.find((t) => t.id === id)
    if (!task || task.status === status) return
    const label = STATUSES.find((s) => s.id === status)?.label
    update(
      updateTasks((tasks) => tasks.map((t) => (t.id === id ? { ...t, status } : t))),
      `Moved to ${label}.`,
    )
  }

  // Hand off from the card's dropdown
  function handOff(id, name) {
    update(
      updateTasks((tasks) => tasks.map((t) => (t.id === id ? { ...t, assignee: name } : t))),
      handOffMessage(name),
    )
  }

  // FR15: add a team member
  function addMember(name) {
    const member = createMember(name)
    return update((b) => ({ ...b, team: [...b.team, member] }), `${member.name} joined the team.`)
  }

  // FR21: save or clear a deliverable link
  function saveAnchor(id, url) {
    const label = boardRef.current.anchors.find((a) => a.id === id)?.label
    return update(
      (b) => ({ ...b, anchors: b.anchors.map((a) => (a.id === id ? { ...a, url } : a)) }),
      url ? `${label} link saved.` : `${label} link cleared.`,
    )
  }

  // FR19: copy a task as a Markdown briefing (DESIGN.md §5 toast)
  async function copyContext(task) {
    const copied = await copyToClipboard(buildPromptContext(task))
    notify(
      copied ? 'Copied. Go pick up where you left off.' : "Couldn't reach the clipboard. Try again.",
      copied ? 'success' : 'error',
    )
  }

  const editingTask = modal?.mode === 'edit' ? board?.tasks.find((t) => t.id === modal.taskId) : null

  return (
    <TeamContext.Provider value={board?.team.map((m) => m.name) ?? []}>
      <div className="min-h-screen bg-surface-page text-text-primary">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <header className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
            <div>
              <p className="font-heading text-2xl font-semibold text-brand-primary">
                Vibe Board<span className="text-brand-accent">.</span>
              </p>
              <h1 className="mt-1 text-sm text-text-muted">{user.name}'s project board</h1>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* FR28 */}
              <button
                type="button"
                onClick={onLogOut}
                className={`rounded-md border border-brand-primary px-3 py-2 text-sm font-medium text-brand-primary hover:bg-brand-primary/5 ${focusRing}`}
              >
                Log out
              </button>
              {/* FR6: "+" button opens the create modal */}
              <button
                type="button"
                disabled={!board}
                onClick={() => setModal({ mode: 'create' })}
                className={`rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-surface-page hover:bg-brand-primary/90 disabled:opacity-60 ${focusRing}`}
              >
                + New Task
              </button>
            </div>
          </header>

          {loadError && (
            <div
              role="alert"
              className="rounded-lg border border-due-warning bg-due-warning-bg p-4 text-sm text-due-warning-text"
            >
              Couldn't load your board.{' '}
              <button type="button" onClick={fetchBoard} className={`font-medium underline ${focusRing}`}>
                Try again
              </button>
            </div>
          )}

          {!board && !loadError && (
            <p className="py-20 text-center text-sm text-text-muted">Loading your board…</p>
          )}

          {board && (
            <>
              <AnchorBoard anchors={board.anchors} onSave={saveAnchor} />
              <TeamStrip team={board.team} tasks={board.tasks} onAddMember={addMember} />
              <Board
                tasks={board.tasks}
                now={now}
                onOpenTask={(id) => setModal({ mode: 'edit', taskId: id })}
                onStatusChange={changeStatus}
                onHandOff={handOff}
                onCopy={copyContext}
              />
            </>
          )}
        </div>

        {modal && board && (
          <TaskModal
            key={modal.mode === 'edit' ? modal.taskId : 'new'}
            task={editingTask}
            defaultAssignee={user.name}
            onSave={saveTask}
            onDelete={deleteTask}
            onClose={closeModal}
            onCopy={copyContext}
          />
        )}
      </div>
    </TeamContext.Provider>
  )
}
