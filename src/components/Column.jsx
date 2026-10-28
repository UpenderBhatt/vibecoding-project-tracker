import { useState } from 'react'
import TaskCard from './TaskCard.jsx'

export default function Column({
  statusId,
  label,
  tasks,
  now,
  onOpenTask,
  onStatusChange,
  onHandOff,
  onCopy,
}) {
  // FR14: the column highlights while a card is dragged over it
  const [dropTarget, setDropTarget] = useState(false)

  return (
    <section
      aria-label={label}
      onDragOver={(e) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        if (!dropTarget) setDropTarget(true)
      }}
      onDragLeave={(e) => {
        // Only when the pointer actually leaves the column, not when it moves over a card inside it
        if (!e.currentTarget.contains(e.relatedTarget)) setDropTarget(false)
      }}
      onDrop={(e) => {
        e.preventDefault()
        setDropTarget(false)
        const taskId = e.dataTransfer.getData('text/plain')
        if (taskId) onStatusChange(taskId, statusId)
      }}
      className={`flex flex-col rounded-lg p-3 transition-colors lg:min-h-[24rem] ${
        dropTarget ? 'bg-brand-primary/10 ring-2 ring-brand-primary/40' : 'bg-border-subtle/40'
      }`}
    >
      <header className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-text-primary">{label}</h2>
        <span className="rounded-full bg-surface-card px-2 py-0.5 text-xs text-text-muted">
          {tasks.length}
        </span>
      </header>

      {tasks.length === 0 ? (
        <p className="flex min-h-[5rem] flex-1 items-center justify-center rounded-lg border border-dashed border-border-subtle p-4 text-center text-sm text-text-muted">
          {dropTarget ? 'Drop it here.' : 'Nothing here yet. Enjoy the quiet.'}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              now={now}
              onOpen={onOpenTask}
              onStatusChange={onStatusChange}
              onHandOff={onHandOff}
              onCopy={onCopy}
            />
          ))}
        </div>
      )}
    </section>
  )
}
