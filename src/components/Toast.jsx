import { useEffect, useState } from 'react'

// NFR8: a short message after every action. NFR9: errors use the same toast in red.
// DESIGN.md §7: the only animation allowed is a 200 ms fade on toasts.
const TONES = {
  success: 'bg-text-primary text-surface-page',
  error: 'bg-due-warning-bg text-due-warning-text border border-due-warning',
}

export default function Toast({ message, tone = 'success', onDone }) {
  const [visible, setVisible] = useState(false)
  const duration = tone === 'error' ? 5000 : 3000 // errors stay a little longer

  useEffect(() => {
    const show = requestAnimationFrame(() => setVisible(true))
    const hide = setTimeout(() => setVisible(false), duration)
    const done = setTimeout(onDone, duration + 200)
    return () => {
      cancelAnimationFrame(show)
      clearTimeout(hide)
      clearTimeout(done)
    }
  }, [onDone, duration])

  return (
    <div
      className={`fixed bottom-6 left-1/2 z-[60] w-max max-w-[calc(100%-2rem)] -translate-x-1/2 rounded-md px-4 py-2.5 text-center text-sm shadow-lg transition-opacity duration-200 ${TONES[tone]} ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {message}
    </div>
  )
}
