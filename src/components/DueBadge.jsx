// M8 due-tint: card tints and the due badge for each state (FR16).
// The badge always carries an icon and words, never colour alone (NFR6).
// Icons are Lucide (https://lucide.dev, ISC licence), copied in as inline SVG.

// Full class names written out so Tailwind can find them.
export const DUE_STYLES = {
  safe: {
    card: 'bg-due-safe-card border-due-safe/40',
    badge: 'border-due-safe text-due-safe-text',
  },
  soon: {
    card: 'bg-due-soon-card border-due-soon/50',
    badge: 'border-due-soon text-due-soon-text',
  },
  warning: {
    card: 'bg-due-warning-card border-due-warning/40',
    badge: 'border-due-warning text-due-warning-text',
  },
  overdue: {
    card: 'bg-due-overdue-card border-due-overdue/40',
    badge: 'border-due-overdue text-due-overdue-text',
  },
  neutral: {
    card: 'bg-surface-card border-border-subtle', // done: no tint
    badge: 'border-due-neutral text-due-neutral-text',
  },
}

const ICONS = {
  // calendar
  safe: (
    <>
      <path d="M8 2v3" />
      <path d="M16 2v3" />
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
    </>
  ),
  // clock
  soon: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </>
  ),
  // alarm-clock
  warning: (
    <>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2 2" />
      <path d="M5 3 2 6" />
      <path d="m22 6-3-3" />
      <path d="M6.38 18.7 4 21" />
      <path d="M17.64 18.67 20 21" />
    </>
  ),
  // calendar-x
  overdue: (
    <>
      <path d="M8 2v3" />
      <path d="M16 2v3" />
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="m14 13-4 4" />
      <path d="m10 13 4 4" />
    </>
  ),
  // circle-check
  neutral: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="m16 9-5.5 5.5L8 12" />
    </>
  ),
}

export default function DueBadge({ state, dueDate }) {
  if (!state) return null
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border bg-surface-card px-2 py-0.5 text-[11px] font-medium ${DUE_STYLES[state.key].badge}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-3 w-3"
      >
        {ICONS[state.key]}
      </svg>
      <time dateTime={dueDate}>{state.label}</time>
    </span>
  )
}
