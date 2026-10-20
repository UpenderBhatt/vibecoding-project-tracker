import { TEAM } from '../data/team.js'

// M7: each teammate gets their own avatar colour, picked from the DESIGN.md
// brand tokens, so you can tell whose task it is at a glance.
const PERSON_STYLES = [
  'bg-brand-primary text-surface-page', // first teammate: forest green
  'bg-brand-accent text-text-primary', // second: amber
  'bg-text-primary text-surface-page', // third: charcoal
]

const SIZES = {
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-7 w-7 text-[11px]',
  lg: 'h-9 w-9 text-xs',
}

export function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function Avatar({ name, size = 'md' }) {
  const index = Math.max(TEAM.indexOf(name), 0)
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
