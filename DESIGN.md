# Vibecoding Project Tracker — Design

**Status:** Hackathon starter design doc · fill in the **`<TODO>`** sections before you tag `design-done`.

**Why this file exists.** This tracker is your tool. It should look like *your* tool — not a generic Kanban with default Tailwind blue. Twenty minutes of design decisions here will be visible on every screen for the next six weeks of Module 5.

**Who owns this.** Person B, during the same window the rest of the team is reviewing the PRD. By the time the team converges to start M4 (`data-model`), this file should be filled in and the colors should already be in `tailwind.config.js`.

---

## 1. Mood / vibe

One sentence that captures the feeling the tracker should leave you with.

`Calm well-kept notebook: warm paper and nothing is chaotic`

Two or three references that capture the vibe (links to dribbble shots, screenshots of apps you admire, Pinterest boards — anything visual):

- `Things 3`
- `Notepad`
- `Field notes`

Anti-references — what we are explicitly **not** trying to look like:

- `Default tailwind starter`

## 2. Color palette

These are the colors the build milestones will reference. Once chosen, paste the hex values into `tailwind.config.js` so the rest of the team can use Tailwind utility classes (e.g. `bg-brand-primary`, `border-due-warning`).

### Brand

| Token | Hex | Where it shows up |
|---|---|---|
| `brand-primary` | `#2F5D50` | Header, "+" button, focus rings |
| `brand-accent` | `#E9A23B` | Highlights, hover states, links |
| `surface-page` | `#FAF7F2` | Page background |
| `surface-card` | `#FFFDF9` | Card background |
| `text-primary` | `#2B2A27` | Body text |
| `text-muted` | `#7A746A` | Captions, dates, counts |

### Task type (M6 `tag-style`)

| Token | Hex | When used |
|---|---|---|
| `type-feature` | `#4C7A9B` | Cards tagged `feature` (accent stripe + icon) |
| `type-bug` | `#8E4A7A` | Cards tagged `bug` (accent stripe + icon) |

### Due-date states (M8 `due-tint`)

| Token | Hex | When used |
|---|---|---|
| `due-safe` | `#5E9C6A` | More than 2 days out |
| `due-warning` | `#E3B23C` | Less than 24 hours |
| `due-overdue` | `#3D6FB0` | Past due |
| `due-neutral` | `#A8A29E` | Done (overrides date) |

## 3. Typography

| Role | Font | Why |
|---|---|---|
| Heading | `<Fraunces>` | `<Soft slightly old-style and not to formal  >` |
| Body | `<Inter>` | `<Easily readable>` |
| Monospace (tags, badges, code) | `<IBM Plex Mono>` | `<Warm and easy to read in prompt boxes>` |

Suggested sizes (override only if the design demands it):

- Page title: 24 px / semibold
- Section header: 16 px / semibold uppercase
- Card title: 14 px / medium
- Body: 14 px / regular
- Caption: 12 px / regular muted

## 4. Component principles

One short sentence per element. These set the tone for the build phase — Person A's modal and Person B's anchor board should both feel like they came from this doc.

- **Cards:** `<A sheet on paper, 1px subtle border, 3px stripe in type colour and faint shadow only on hover.>` (e.g. "Light, almost weightless; the only weight is from a 1px border, no shadow except on hover.")
- **Buttons:** `<Solid primary, paper-coloured text, rounded-md, 1px gradient and no graident.>` (e.g. "Solid fill, no gradient, generous padding, rounded-md.")
- **Modal:** `<Centered, max-width-md, generous padding at 40% opacity.>` (e.g. "Centered, max-width-md, slate-900 backdrop at 50% opacity.")
- **Empty states:** `<Dashed outline, muted text, one calm line - never sad.>` (e.g. "Dashed border, muted text, never sad.")
- **Drag affordance (if used):** `<>` (e.g. "None — we use a status dropdown.")

## 5. Voice / microcopy

Three lines of microcopy that capture the tone of the product. Keep it short — these are the words a stressed user reads at 11pm.

| Where | Text |
|---|---|
| "+" button label | `+ New Task` (e.g. "+ Task" or "Add task" or "New") |
| Empty column placeholder | `Nothing here yet. Enjoy  the quiet.` (e.g. "Nothing here yet — keep going.") |
| Toast after "Copy as Prompt Context" | `Copied. Go pick up where you left off.` (e.g. "Copied. Now paste it into the AI.") |
| Confirm-delete message | `Delete this task? There's no undo.` (e.g. "Delete this task? You can't undo.") |
| Handoff toast (M7 `task-owner`) | `Passed to  {name}. It's on their page now.` (e.g. "Handed off to {name}. They've got it.") |

## 6. Logo / wordmark

The tracker probably doesn't need a logo, but it does need a name and a wordmark style.

- **Product name:** `Vibe Board` (match PRD §11 team identity)
- **Wordmark style:** `<TODO>` (e.g. "Just the name in the heading font, brand-primary color, no icon.")

## 7. Out of scope (this hackathon)

To keep design tight, the following are explicitly not part of `design-done`:

- A dark mode toggle. Pick one mode and ship it.
- Multiple themes. One brand, applied consistently.
- Animations beyond a 200 ms fade on toast notifications.
- A custom icon set. Use [Lucide icons](https://lucide.dev) via Tailwind classes if you need any.

---

*DESIGN.md version: hackathon-starter v1*
