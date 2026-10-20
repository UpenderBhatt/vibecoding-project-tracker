import Board from './components/Board.jsx'
import { createTask, seedTasks } from './data/taskModel.js'
import { useLocalStorage } from './hooks/useLocalStorage.js'

// Clean up whatever was loaded from storage; fall back to the seed if it isn't a list.
function parseTasks(saved) {
  return Array.isArray(saved) ? saved.map(createTask) : seedTasks()
}

export default function App() {
  // From M5 onwards, take setTasks too: const [tasks, setTasks] = ...
  const [tasks] = useLocalStorage('vibeboard.tasks', seedTasks, parseTasks)

  return (
    <div className="min-h-screen bg-surface-page text-text-primary">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-8">
          <h1 className="font-heading text-2xl font-semibold text-brand-primary">
            Vibe Board<span className="text-brand-accent">.</span>
          </h1>
          <p className="mt-1 text-sm text-text-muted">Vibecoding project tracker</p>
        </header>

        <Board tasks={tasks} />
      </div>
    </div>
  )
}
