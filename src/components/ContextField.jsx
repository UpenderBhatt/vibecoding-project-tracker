import { useState } from 'react'
import { CONTEXT_TEMPLATE, formatRelative } from '../data/context.js'
import { CONTEXT_TOOLS } from '../data/taskModel.js'
import { renderMarkdown } from '../utils/markdown.js'

const labelClass = 'mb-1 block text-xs font-medium text-text-muted'
const fieldClass =
  'w-full rounded-md border border-border-subtle bg-surface-page px-3 py-2 text-sm text-text-primary ' +
  'focus:outline-none focus:ring-2 focus:ring-brand-primary'

// Styles for the rendered Markdown preview
const previewClass =
  'min-h-[13.5rem] rounded-md border border-border-subtle bg-surface-card px-3 py-2 text-sm text-text-primary ' +
  '[&_h1]:mb-1 [&_h1]:mt-3 [&_h1]:font-heading [&_h1]:text-base [&_h1]:font-semibold ' +
  '[&_h2]:mb-1 [&_h2]:mt-3 [&_h2]:text-sm [&_h2]:font-semibold ' +
  '[&_h3]:mb-1 [&_h3]:mt-2 [&_h3]:text-sm [&_h3]:font-medium ' +
  '[&>*:first-child]:mt-0 [&_p]:my-1.5 [&_ul]:my-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 ' +
  '[&_code]:rounded [&_code]:bg-surface-page [&_code]:px-1 [&_code]:font-mono [&_code]:text-[12px] ' +
  '[&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-surface-page [&_pre]:p-2'

// FR17: multi-line Markdown context + AI tool dropdown. FR18: last-updated hint.
export default function ContextField({ value, tool, updatedAt, now, onChange, onToolChange }) {
  const [mode, setMode] = useState('write') // 'write' | 'preview'

  const tabClass = (active) =>
    `rounded px-2 py-0.5 text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
      active ? 'bg-surface-card text-brand-primary shadow-sm' : 'text-text-muted hover:text-text-primary'
    }`

  return (
    <div className="rounded-lg border border-border-subtle bg-surface-page/60 p-3">
      <div className="mb-1 flex items-center justify-between gap-2">
        <label htmlFor="task-context" className="text-sm font-semibold text-text-primary">
          Context
        </label>
        {/* Stretch: Markdown preview */}
        <div className="flex gap-1 rounded-md bg-border-subtle/60 p-0.5">
          <button type="button" aria-pressed={mode === 'write'} onClick={() => setMode('write')} className={tabClass(mode === 'write')}>
            Write
          </button>
          <button type="button" aria-pressed={mode === 'preview'} onClick={() => setMode('preview')} className={tabClass(mode === 'preview')}>
            Preview
          </button>
        </div>
      </div>
      <p id="task-context-hint" className="mb-2 text-xs text-text-muted">
        Markdown. Whatever the next teammate or AI needs to pick this up.
      </p>

      {mode === 'write' ? (
        <textarea
          id="task-context"
          rows={9}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby="task-context-hint task-context-updated"
          className={`${fieldClass} resize-y bg-surface-card font-mono text-[13px] leading-relaxed`}
        />
      ) : value.trim() ? (
        <div className={previewClass} dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }} />
      ) : (
        <p className={`${previewClass} text-text-muted`}>Nothing to preview yet.</p>
      )}

      {mode === 'write' && !value.trim() && (
        <button
          type="button"
          onClick={() => onChange(CONTEXT_TEMPLATE)}
          className="mt-1 text-xs font-medium text-brand-primary underline decoration-brand-accent underline-offset-2 hover:decoration-2"
        >
          Use the template
        </button>
      )}

      <div className="mt-3 flex items-end justify-between gap-3">
        <div className="w-40">
          <label htmlFor="task-context-tool" className={labelClass}>
            AI tool <span className="font-normal">(optional)</span>
          </label>
          <select
            id="task-context-tool"
            value={tool ?? ''}
            onChange={(e) => onToolChange(e.target.value || null)}
            className={`${fieldClass} bg-surface-card py-1.5`}
          >
            <option value="">None</option>
            {CONTEXT_TOOLS.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <p id="task-context-updated" className="pb-2 text-right text-xs text-text-muted">
          {updatedAt ? `Last updated ${formatRelative(updatedAt, now)}` : 'Not saved yet'}
        </p>
      </div>
    </div>
  )
}
