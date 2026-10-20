import { useEffect, useState } from 'react'

// DESIGN.md §7: the only animation allowed is a 200 ms fade on toasts.
// Shows for about 3 seconds, then fades out and calls onDone.
export default function Toast({ message, onDone }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const show = requestAnimationFrame(() => setVisible(true))
    const hide = setTimeout(() => setVisible(false), 3000)
    const done = setTimeout(onDone, 3200)
    return () => {
      cancelAnimationFrame(show)
      clearTimeout(hide)
      clearTimeout(done)
    }
  }, [onDone])

  return (
    <div
      className={`fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-md bg-text-primary px-4 py-2.5 text-sm text-surface-page shadow-lg transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {message}
    </div>
  )
}
