import { STATUSES } from '../data/taskModel.js'
import Column from './Column.jsx'

// NFR13: one column on phones, two on tablets, four on laptops and up
export default function Board({ tasks, now, onOpenTask, onStatusChange, onHandOff, onCopy }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {STATUSES.map((status) => (
        <Column
          key={status.id}
          statusId={status.id}
          label={status.label}
          tasks={tasks.filter((task) => task.status === status.id)}
          now={now}
          onOpenTask={onOpenTask}
          onStatusChange={onStatusChange}
          onHandOff={onHandOff}
          onCopy={onCopy}
        />
      ))}
    </div>
  )
}
