import TaskCard from './TaskCard.jsx'

export default function Column({ label, tasks, onOpenTask, onStatusChange }) {
  return (
    <section className="flex min-h-[24rem] flex-col rounded-lg bg-border-subtle/40 p-3">
      <header className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-text-primary">{label}</h2>
        <span className="rounded-full bg-surface-card px-2 py-0.5 text-xs text-text-muted">
          {tasks.length}
        </span>
      </header>

      {tasks.length === 0 ? (
        <p className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border-subtle p-4 text-center text-sm text-text-muted">
          Nothing here yet. Enjoy the quiet.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onOpen={onOpenTask} onStatusChange={onStatusChange} />
          ))}
        </div>
      )}
    </section>
  )
}
