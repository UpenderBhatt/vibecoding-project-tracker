// M10: the "Copy Context" button, used on every card and inside the modal.
// Icon is Lucide "copy" (https://lucide.dev, ISC licence) as inline SVG.
export default function CopyContextButton({ onClick, label = 'Copy Context', ariaLabel, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={`relative z-10 inline-flex items-center gap-1 rounded-md border border-border-subtle bg-surface-card px-2 py-0.5 text-[11px] font-medium text-brand-primary hover:border-brand-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${className}`}
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
        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
      </svg>
      {label}
    </button>
  )
}
