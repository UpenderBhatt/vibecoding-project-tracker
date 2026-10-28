import { useEffect, useRef, useState } from 'react'
import { ApiError, logIn, signUp } from '../api/client.js'

// FR26 (sign-up page) and FR27 (login page). Only name, email and password are asked for (NFR12).

const fieldClass =
  'w-full rounded-md border bg-surface-page px-3 py-2 text-sm text-text-primary ' +
  'focus:outline-none focus:ring-2 focus:ring-brand-primary'
const focusRing =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2'

function Field({ id, label, type = 'text', value, onChange, error, autoComplete, inputRef, hint }) {
  const describedBy = [error && `${id}-error`, hint && `${id}-hint`].filter(Boolean).join(' ') || undefined
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-xs font-medium text-text-muted">
        {label}
      </label>
      <input
        id={id}
        ref={inputRef}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={describedBy}
        className={`${fieldClass} ${error ? 'border-due-warning' : 'border-border-subtle'}`}
      />
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-due-warning-text">
          {error}
        </p>
      )}
    </div>
  )
}

export default function AuthPage({ mode, onAuthenticated }) {
  const isSignUp = mode === 'signup'
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)
  const firstFieldRef = useRef(null)

  // Fresh form whenever you switch between the two pages
  useEffect(() => {
    setErrors({})
    setFormError('')
    setForm((f) => ({ ...f, password: '' }))
    firstFieldRef.current?.focus()
  }, [mode])

  const update = (field) => (value) => {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setBusy(true)
    setFormError('')
    try {
      const user = isSignUp ? await signUp(form) : await logIn({ email: form.email, password: form.password })
      onAuthenticated(user, isSignUp)
    } catch (err) {
      if (err instanceof ApiError) {
        setErrors(err.fields)
        setFormError(err.message)
      } else {
        setFormError("Couldn't reach the server. Try again.")
      }
      setBusy(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-page px-4 py-10 text-text-primary">
      <div className="w-full max-w-sm">
        <p className="mb-6 text-center font-heading text-2xl font-semibold text-brand-primary">
          Vibe Board<span className="text-brand-accent">.</span>
        </p>

        <div className="rounded-lg border border-border-subtle bg-surface-card p-6 shadow-sm sm:p-8">
          <h1 className="font-heading text-xl font-semibold text-brand-primary">
            {isSignUp ? 'Create your account' : 'Log in'}
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            {isSignUp ? 'Your board, your team, your prompts.' : 'Pick up where you left off.'}
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            {isSignUp && (
              <Field
                id="auth-name"
                label="Name"
                value={form.name}
                onChange={update('name')}
                error={errors.name}
                autoComplete="name"
                inputRef={firstFieldRef}
              />
            )}
            <Field
              id="auth-email"
              label="Email"
              type="email"
              value={form.email}
              onChange={update('email')}
              error={errors.email}
              autoComplete="email"
              inputRef={isSignUp ? undefined : firstFieldRef}
            />
            <Field
              id="auth-password"
              label="Password"
              type="password"
              value={form.password}
              onChange={update('password')}
              error={errors.password}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              hint={isSignUp ? 'At least 8 characters.' : undefined}
            />

            {formError && (
              <p
                role="alert"
                className="rounded-md bg-due-warning-bg px-3 py-2 text-sm text-due-warning-text"
              >
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className={`w-full rounded-md bg-brand-primary px-4 py-2.5 text-sm font-medium text-surface-page hover:bg-brand-primary/90 disabled:opacity-60 ${focusRing}`}
            >
              {busy
                ? isSignUp
                  ? 'Creating account…'
                  : 'Logging in…'
                : isSignUp
                  ? 'Create account'
                  : 'Log in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            {isSignUp ? 'Already have an account? ' : 'New to Vibe Board? '}
            <a
              href={isSignUp ? '#/login' : '#/signup'}
              className="font-medium text-brand-primary underline decoration-brand-accent underline-offset-2 hover:decoration-2"
            >
              {isSignUp ? 'Log in' : 'Create an account'}
            </a>
          </p>
        </div>

        <p className="mt-4 text-center text-xs text-text-muted">
          Prototype: accounts are stored in this browser only.
        </p>
      </div>
    </main>
  )
}
