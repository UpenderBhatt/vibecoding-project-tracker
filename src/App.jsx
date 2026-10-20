import { useCallback, useState } from 'react'
import Board from './components/Board.jsx'
import TaskModal from './components/TaskModal.jsx'
import TeamStrip from './components/TeamStrip.jsx'
import Toast from './components/Toast.jsx'
import { createTask, seedTasks } from './data/taskModel.js'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { useNow } from './hooks/useNow.js'

// Clean up whatever was loaded from storage; fall back to the seed if it isn't a list.
function parseTasks(saved) {
  return Array.isArray(saved) ? saved.map(createTask) : seedTasks()
}

// DESIGN.md §5 handoff microcopy
const handOffMessage = (name) => `Passed to ${name}. It's on their page now.`

export default function App() {
  // FR23: every change is saved to localStorage and reloaded on page open
  const [tasks, setTasks] = useLocalStorage('vibeboard.tasks', seedTasks, parseTasks)

  // M8: ticks every minute so due colours update by themselves
  const now = useNow()

  // null = closed, { mode: 'create' } or { mode: 'edit', taskId }
  const [modal, setModal] = useState(null)
  const editingTask = modal?.mode === 'edit' ? tasks.find((t) => t.id === modal.taskId) : null

  // Toast: { id, message } or null
  const [toast, setToast] = useState(null)
  const showToast = (message) => setToast({ id: Date.now(), message })
  const clearToast = useCallback(() => setToast(null), [])

  const closeModal = useCallback(() => setModal(null), [])

  // FR6 / FR7 / FR10: create or update a task from the modal
  function saveTask(fields) {
    if (modal?.mode === 'edit') {
      setTasks((current) =>
        current.map((t) => (t.id === modal.taskId ? createTask({ ...t, ...fields }) : t)),
      )
      // M7: reassigning from the modal is acknowledged too
      if (editingTask && fields.assignee !== editingTask.assignee) {
        showToast(handOffMessage(fields.assignee))
      }
    } else {
      setTasks((current) => [...current, createTask(fields)])
    }
    setModal(null)
  }

  // FR11: delete (confirmation happens in the modal, NFR4)
  function deleteTask(id) {
    setTasks((current) => current.filter((t) => t.id !== id))
    setModal(null)
  }

  // FR12: status dropdown on the card
  function changeStatus(id, status) {
    setTasks((current) => current.map((t) => (t.id === id ? { ...t, status } : t)))
  }

  // FR15: hand off from the card's "Hand off to…" dropdown
  function handOff(id, name) {
    setTasks((current) => current.map((t) => (t.id === id ? { ...t, assignee: name } : t)))
    showToast(handOffMessage(name))
  }

  return (
    <div className="min-h-screen bg-surface-page text-text-primary">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-semibold text-brand-primary">
              Vibe Board<span className="text-brand-accent">.</span>
            </h1>
            <p className="mt-1 text-sm text-text-muted">Vibecoding project tracker</p>
          </div>

          {/* FR6: "+" button opens the create modal */}
          <button
            type="button"
            onClick={() => setModal({ mode: 'create' })}
            className="rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-surface-page hover:bg-brand-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
          >
            + New Task
          </button>
        </header>

        <TeamStrip tasks={tasks} />

        <Board
          tasks={tasks}
          now={now}
          onOpenTask={(id) => setModal({ mode: 'edit', taskId: id })}
          onStatusChange={changeStatus}
          onHandOff={handOff}
        />
      </div>

      {modal && (
        <TaskModal
          key={modal.mode === 'edit' ? modal.taskId : 'new'}
          task={editingTask}
          onSave={saveTask}
          onDelete={deleteTask}
          onClose={closeModal}
        />
      )}

      {/* Screen readers announce whatever appears here */}
      <div role="status" aria-live="polite">
        {toast && <Toast key={toast.id} message={toast.message} onDone={clearToast} />}
      </div>
    </div>
  )
}
