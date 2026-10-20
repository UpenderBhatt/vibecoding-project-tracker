import { useState } from 'react'
import { displayHost, normaliseUrl } from '../data/anchors.js'

// M11 project-deliverables: four pinned deliverable slots above the board (FR20–FR22).
// Icons are Lucide (https://lucide.dev, ISC licence) as inline SVG.

const iconProps = {
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary'

function AnchorCard({ anchor, onSave }) {
  const [draft, setDraft] = useState(anchor.url ?? '')
  const [error, setError] = useState('')
  const [confirmingClear, setConfirmingClear] = useState(false)
  const filled = Boolean(anchor.url)
  const inputId = `anchor-${anchor.id}`

  // Save on Enter or when the field loses focus (FR21)
  function commit() {
    const { url, error: problem } = normaliseUrl(draft)
    if (problem) {
      setError(problem)
      return
    }
    setError('')
    if (url === anchor.url) {
      setDraft(anchor.url ?? '')
      return
    }
    // Emptying the field counts as clearing, which asks first (NFR4)
    if (!url && anchor.url) {
      setConfirmingClear(true)
      return
    }
    onSave(anchor.id, url)
    setDraft(url ?? '')
  }

  function clearLink() {
    onSave(anchor.id, null)
    setDraft('')
    setConfirmingClear(false)
  }

  function keepLink() {
    setDraft(anchor.url ?? '')
    setConfirmingClear(false)
  }

  return (
    <div
      className={`rounded-lg border bg-surface-card p-3 ${
        filled ? 'border-brand-primary/40' : 'border-border-subtle'
      }`}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <label htmlFor={inputId} className="text-sm font-semibold text-text-primary">
          {anchor.label}
        </label>

        {/* Status indicator: empty / filled dot, plus words so it isn't colour alone */}
        <span className="inline-flex items-center gap-1.5 text-[11px] text-text-muted">
          <span
            aria-hidden="true"
            className={`h-2.5 w-2.5 rounded-full border-2 ${
              filled ? 'border-brand-primary bg-brand-primary' : 'border-text-muted bg-transparent'
            }`}
          />
          {filled ? 'Linked' : 'No link yet'}
        </span>
      </div>

      {confirmingClear ? (
        <div className="flex items-center justify-between gap-2 rounded-md bg-due-warning-bg px-2 py-1.5">
          <p className="text-xs text-text-primary">Clear this link?</p>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={keepLink}
              className={`rounded border border-border-subtle bg-surface-card px-2 py-0.5 text-xs ${focusRing}`}
            >
              Keep
            </button>
            <button
              type="button"
              onClick={clearLink}
              className={`rounded bg-due-warning px-2 py-0.5 text-xs font-medium text-surface-page ${focusRing}`}
            >
              Clear
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <input
            id={inputId}
            type="url"
            inputMode="url"
            value={draft}
            placeholder="Paste a link…"
            onChange={(e) => {
              setDraft(e.target.value)
              if (error) setError('')
            }}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                commit()
              }
              if (e.key === 'Escape') {
                e.stopPropagation()
                setDraft(anchor.url ?? '')
                setError('')
              }
            }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={`min-w-0 flex-1 rounded-md border bg-surface-page px-2 py-1.5 text-xs text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-brand-primary ${
              error ? 'border-due-warning' : 'border-border-subtle'
            }`}
          />

          {filled && (
            <>
              {/* FR22: a filled slot opens its link in a new tab */}
              <a
                href={anchor.url}
                target="_blank"
                rel="noopener noreferrer"
                title={anchor.url}
                aria-label={`Open ${anchor.label} (${displayHost(anchor.url)}) in a new tab`}
                className={`rounded-md p-1.5 text-brand-primary hover:bg-brand-primary/10 ${focusRing}`}
              >
                <svg {...iconProps} className="h-4 w-4">
                  <path d="M15 3h6v6" />
                  <path d="M10 14 21 3" />
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                </svg>
              </a>
              {/* FR21: clear the link (asks first — NFR4) */}
              <button
                type="button"
                onClick={() => setConfirmingClear(true)}
                aria-label={`Clear the ${anchor.label} link`}
                className={`rounded-md p-1.5 text-text-muted hover:bg-due-warning-bg hover:text-due-warning-text ${focusRing}`}
              >
                <svg {...iconProps} className="h-4 w-4">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </>
          )}
        </div>
      )}

      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-[11px] text-due-warning-text">
          {error}
        </p>
      )}
    </div>
  )
}

export default function AnchorBoard({ anchors, onSave }) {
  const linked = anchors.filter((a) => a.url).length

  return (
    <section aria-labelledby="deliverables-heading" className="mb-6">
      <div className="mb-2 flex items-baseline justify-between">
        <h2
          id="deliverables-heading"
          className="text-[13px] font-semibold uppercase tracking-wide text-text-primary"
        >
          Deliverables
        </h2>
        <p className="text-xs text-text-muted">{linked} of 4 linked</p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {anchors.map((anchor) => (
          <AnchorCard key={anchor.id} anchor={anchor} onSave={onSave} />
        ))}
      </div>
    </section>
  )
}
