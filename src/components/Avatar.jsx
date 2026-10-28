import { createContext, useContext } from 'react'

// The current team's names, in the order they were added (FR15)
export const TeamContext = createContext([])

// Each teammate gets their own avatar colour from the DESIGN.md tokens, so you can
// tell whose task it is at a glance. Colours repeat after six people.
// Every pair passes 4.5:1 text contrast.
const PERSON_STYLES = [
  'bg-brand-primary text-surface-page', // forest green
  'bg-brand-accent text-text-primary', // amber
  'bg-text-primary text-surface-page', // charcoal
  'bg-type-bug text-surface-page', // plum
  'bg-type-feature-text text-surface-page', // slate blue
  'bg-due-safe-text text-surface-page', // sage
]

const SIZES = {
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-7 w-7 text-[11px]',
  lg: 'h-9 w-9 text-xs',
}

export function initials(name) {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '?'
  )
}

export default function Avatar({ name, size = 'md' }) {
  const team = useContext(TeamContext)
  const index = Math.max(team.indexOf(name), 0)
  return (
    <span
      aria-hidden="true"
      title={name}
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${SIZES[size]} ${PERSON_STYLES[index % PERSON_STYLES.length]}`}
    >
      {initials(name)}
    </span>
  )
}
