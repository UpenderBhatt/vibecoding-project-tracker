// M6 tag-style: one place that defines how each task type looks, so the board,
// the modal and anywhere else a task is shown stay consistent (FR13, NFR6).
//
// Icons are Lucide (https://lucide.dev, ISC licence) "sparkles" and "bug",
// copied in as inline SVG so no extra package is needed.

// Full class names written out so Tailwind can find them.
export const TYPE_STYLES = {
  feature: {
    label: 'Feature',
    text: 'text-type-feature',
    stripe: 'border-l-type-feature', // card left stripe
    topStripe: 'border-t-type-feature', // modal top stripe
    selected: 'border-type-feature ring-1 ring-type-feature',
  },
  bug: {
    label: 'Bug',
    text: 'text-type-bug',
    stripe: 'border-l-type-bug',
    topStripe: 'border-t-type-bug',
    selected: 'border-type-bug ring-1 ring-type-bug',
  },
}

const ICON_PATHS = {
  feature: (
    <>
      <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
      <path d="M20 2v4" />
      <path d="M22 4h-4" />
      <circle cx="4" cy="20" r="2" />
    </>
  ),
  bug: (
    <>
      <path d="M12 20v-9" />
      <path d="M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4z" />
      <path d="M14.12 3.88 16 2" />
      <path d="M21 21a4 4 0 0 0-3.81-4" />
      <path d="M21 5a4 4 0 0 1-3.55 3.97" />
      <path d="M22 13h-4" />
      <path d="M3 21a4 4 0 0 1 3.81-4" />
      <path d="M3 5a4 4 0 0 0 3.55 3.97" />
      <path d="M6 13H2" />
      <path d="m8 2 1.88 1.88" />
      <path d="M9 7.13V6a3 3 0 1 1 6 0v1.13" />
    </>
  ),
}

export function TypeIcon({ type, className = 'h-3.5 w-3.5' }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {ICON_PATHS[type]}
    </svg>
  )
}

// Icon + text label in the type colour (never colour alone — NFR6).
export default function TypeBadge({ type }) {
  const style = TYPE_STYLES[type]
  return (
    <span
      className={`inline-flex items-center gap-1 font-mono text-[11px] font-medium uppercase tracking-wide ${style.text}`}
    >
      <TypeIcon type={type} />
      {style.label}
    </span>
  )
}
