import { STATUSES } from '../data/taskModel.js'
import Column from './Column.jsx'

export default function Board({ tasks, now, onOpenTask, onStatusChange, onHandOff }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {STATUSES.map((status) => (
        <Column
          key={status.id}
          label={status.label}
          tasks={tasks.filter((task) => task.status === status.id)}
          now={now}
          onOpenTask={onOpenTask}
          onStatusChange={onStatusChange}
          onHandOff={onHandOff}
        />
      ))}
    </div>
  )
}
