# CLAUDE.md — Frontend

This file defines the architecture, conventions, and patterns of the **frontend**.
Read this before writing any component, hook, page, or suggesting any structure.

The backend has its own `CLAUDE.md` at the project root. This file covers `frontend/` only.

---

## Project Type

Single Page Application (SPA) built with **Vite + React**.
It is a pure client: it runs in the browser and talks to the Express backend over HTTP.
There is **no server-side rendering and no backend logic here** — the backend already exists.

---

## Monorepo Position

```
root/
├── backend/   → Express API (out of scope here)
├── frontend/  → this package
└── shared/    → Zod schemas + CASL abilities + cross-boundary types
```

The frontend depends on `shared` as a workspace package (`"shared": "workspace:*"`).
`shared/` is the **only** bridge between frontend and backend.

**Never import from `backend/`.** If the frontend needs a type or schema that the
backend also uses, it lives in `shared/`.

### Importing from shared

`shared/package.json` exposes schemas through its `exports` map. The correct import
path is `shared/schemas/<file>` — **not** `shared/src/schemas/<file>`.

```typescript
import { registerDriverSchema } from 'shared/schemas/auth'
```

---

## Stack

- **Build tool:** Vite
- **Language:** TypeScript
- **UI library:** React
- **Routing:** React Router
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui (copied into the repo, owned by us)
- **Server state / data fetching:** TanStack Query (`@tanstack/react-query`)
- **Client state:** React built-ins (`useState`, `useReducer`, Context) — no state library yet
- **Forms:** React Hook Form + Zod (schemas from `shared/`)
- **Validation:** Zod (single source of truth, imported from `shared/`)
- **Permissions:** CASL (abilities from `shared/`)
- **HTTP client:** a single typed `fetch` wrapper in `src/lib/api.ts`
- **Test runner:** Vitest
- **Component testing:** React Testing Library

---

## Folder Structure

```
frontend/
└── src/
    ├── main.tsx                → app entry; mounts <App/>, sets up providers
    ├── App.tsx                 → router + global providers (QueryClient, Auth, Ability)
    ├── routes.tsx              → route definitions, public vs protected
    ├── lib/
    │   ├── api.ts              → single typed fetch wrapper (base URL, auth header, error mapping)
    │   ├── queryClient.ts      → single QueryClient instance
    │   └── ability.ts          → builds CASL ability from the current user
    ├── components/
    │   ├── ui/                 → shadcn/ui primitives (button, input, dialog…)
    │   └── [Shared]/           → reusable app-level components (not feature-specific)
    ├── features/
    │   └── [feature]/
    │       ├── components/     → components used only by this feature
    │       ├── hooks/          → useXxxQuery / useXxxMutation (TanStack Query)
    │       ├── api.ts          → functions that call the backend for this feature
    │       └── [Feature]Page.tsx → the page/screen for this feature
    ├── hooks/                  → cross-feature hooks (e.g. useAuth, useAbility)
    ├── providers/              → React context providers (AuthProvider, AbilityProvider)
    └── test/
        └── setup.ts            → Testing Library + Vitest setup
```

**Feature-based, mirroring the backend.** A screen and everything it needs lives under
`features/[feature]/`. Only promote something to `components/` or `hooks/` when a
**second** feature actually needs it — never preemptively.

---

## Component Lifecycle

Components are the thing that rots fastest in a frontend. To avoid a graveyard of unused
files, **every component has a defined home and a defined death.** There are three zones,
each with a different lifecycle:

| Zone | What lives here | When it is created | When it dies |
|---|---|---|---|
| `components/ui/` | shadcn/ui primitives (Button, Input, Dialog) | Added via the shadcn CLI **only when a real screen needs it** — never "just in case" | Almost never (these are the base) |
| `features/[feature]/components/` | A component used by **one** feature only | Freely — this is the default home | **With the feature.** Delete the feature, delete the folder |
| `components/` | A component shared by **2+ features** | Only on the **second** real use | When no feature imports it anymore |

### Rules

- **Rule of two** — never create a component in `components/` (shared) on its first use.
  Keep it inside the feature. Promote it to `components/` only when a **second** feature
  genuinely needs it. This kills most "I thought I'd reuse it" dead code.
- **A component travels with its feature** — keep feature-specific components under
  `features/[feature]/components/`. Deleting a screen then removes its code automatically.
- **shadcn on demand** — add primitives with `pnpm dlx shadcn@latest add <name>` only when
  a screen actually uses one. Never bulk-add components you "might" need — each one added
  is one you now have to maintain.
- **Delete with the feature** — when a feature is removed, delete its entire folder
  (`components/`, `hooks/`, `api.ts`, page). Never leave orphaned files behind.
- **Figma reuses, never duplicates** — when generating a screen from Figma, map it to
  existing components via Code Connect instead of generating fresh markup. The design tool
  must push toward reuse, not toward a pile of near-identical components.

---

## Data Fetching — TanStack Query owns server state

Everything that comes from the backend is **server state** and is managed by TanStack Query.
**Never** store API responses in `useState` and sync them by hand.

### The three layers

1. `features/[feature]/api.ts` — plain async functions that call `api` and return typed data.
2. `features/[feature]/hooks/` — wrap those functions in `useQuery` / `useMutation`.
3. The component — calls the hook, reads `data` / `isLoading` / `error`. No fetching logic inside JSX.

```typescript
// features/drivers/api.ts
import { api } from '../../lib/api'

export async function fetchDrivers() {
  return api.get<Driver[]>('/drivers')
}
```

```typescript
// features/drivers/hooks/useDrivers.ts
import { useQuery } from '@tanstack/react-query'
import { fetchDrivers } from '../api'

export function useDrivers() {
  return useQuery({ queryKey: ['drivers'], queryFn: fetchDrivers })
}
```

```typescript
// features/drivers/DriversPage.tsx
export function DriversPage() {
  const { data, isLoading, error } = useDrivers()
  if (isLoading) return <Spinner />
  if (error) return <ErrorState />
  return <DriverList drivers={data} />
}
```

### Rules

- **Query keys** are arrays starting with the resource name: `['drivers']`, `['drivers', id]`.
- **Mutations** invalidate the relevant query keys on success — do not refetch manually.
- **No `useEffect` + `fetch`** to load data. If you reach for that, you want `useQuery`.
- Types for responses come from `shared/` when they cross the API boundary.

---

## Client State — React built-ins first

State that does **not** come from the API (theme, open/closed menu, multi-step form
progress, current auth session) uses `useState`, `useReducer`, or Context.

**Do not add a state library (Zustand, Redux, etc.).** With TanStack Query handling
server state, very little global client state remains. If a real need appears, stop and
discuss it before adding a dependency.

- Local UI state → `useState` in the component.
- State shared across a subtree → Context provider in `providers/`.
- Auth session and ability live in Context (`AuthProvider`, `AbilityProvider`).

---

## Forms — React Hook Form + Zod from shared

The form schema is **never** redefined in the frontend. Import it from `shared/` — the
same schema the backend validates the request body with.

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerDriverSchema, type RegisterDriverInput } from 'shared/schemas/auth'

export function DriverRegisterForm() {
  const form = useForm<RegisterDriverInput>({
    resolver: zodResolver(registerDriverSchema),
  })
  // ...
}
```

### Rules

- **One Zod schema, defined in `shared/`** — the form and the backend share it.
- **Never** write a separate `interface`/`type` for form values — derive with `z.infer`.
- Field-level errors come from `form.formState.errors`, rendered next to each input.
- The submit handler calls a TanStack Query **mutation**, never `fetch` directly.

---

## Permissions — CASL from shared

Permission rules live in `shared/abilities/`. The frontend builds an ability from the
current user and uses it to **show/hide UI**. This is a UX layer only — the backend still
enforces every rule.

```typescript
import { defineAbilityFor } from 'shared/abilities/user'

const ability = defineAbilityFor(currentUser)

{ability.can('edit', 'Driver') && <EditButton />}
```

### Rules

- Build the ability once and expose it via `AbilityProvider` / a `useAbility()` hook.
- Use ability checks to **conditionally render** actions — never to "secure" anything.
- Never duplicate permission logic in the frontend — the rule lives in `shared/`.

---

## Styling — Tailwind + shadcn/ui

- Style with **Tailwind utility classes** directly on elements. No separate CSS files.
- Use **shadcn/ui** primitives from `components/ui/` for buttons, inputs, dialogs, etc.
  These are copied into the repo and owned by us — edit them when needed.
- **Use design tokens, not magic values.** Prefer Tailwind's theme scale (`p-4`, `text-muted-foreground`)
  over arbitrary values (`p-[13px]`, `text-[#3a3a3a]`). New tokens go in the Tailwind config.
- For conditional classes use the project's `cn()` helper (clsx + tailwind-merge) — never
  build class strings with template literals and manual spacing.

```tsx
<button className={cn('rounded-md px-4 py-2', isActive && 'bg-primary text-white')} />
```

---

## API Client

A single typed wrapper in `src/lib/api.ts` is the only place that knows the base URL,
attaches the auth token, and maps backend error codes.

- Base URL comes from `import.meta.env.VITE_API_URL`.
- It attaches the Bearer access token from the auth session.
- It reads the backend's `{ error: code }` shape and throws a typed error the UI can map.
- Feature `api.ts` files call this wrapper — they never call `fetch` directly.

**Never** hardcode the backend URL or call `fetch` from a component.

---

## Error Handling

The backend returns `{ error: ERROR_CODE }`. The frontend maps codes to user-facing
messages — it never shows raw codes or stack traces to the user.

- Keep a single map from `ErrorCode` → friendly message (pt-BR) in `src/lib/errorMessages.ts`.
- Query/mutation errors render an error state or toast using that map.
- Unknown errors fall back to a generic message — never leak internals.

---

## Environment Variables

- Vite exposes only variables prefixed with `VITE_`.
- Access via `import.meta.env.VITE_*`. **Never** `process.env` in frontend code.
- Required vars are documented in `frontend/.env.example`.
- **Never** put secrets in the frontend — everything here ships to the browser.

---

## Code Conventions

### Naming

- Variables, functions, hooks → `camelCase` in English (hooks start with `use`)
- Components, types → `PascalCase` in English
- Component files → `PascalCase.tsx`; non-component files → `camelCase.ts`
- Global constants → `UPPER_SNAKE_CASE` in English

### TypeScript

Same non-negotiable strictness as the backend.

- **Never use `any`** — declare the type explicitly if it is not inferred.
- **Never cast with `as`** to silence an error — fix the type.
- **Never use `@ts-ignore` / `@ts-expect-error`** without a documented reason.
- **Derive types from Zod schemas** (`z.infer`) — never duplicate type definitions.
- Type component props explicitly; type hook return values when not inferred.

### ESLint

- **Never disable ESLint rules** with `// eslint-disable` or similar — fix the code.
- ESLint errors must be resolved before a task is considered complete.

### Components

- One component per file. Keep components small; extract when a file does too much.
- No business logic in JSX — compute above the `return`, or in a hook.
- Prefer composition over props explosion. Lift state only as far as needed.

---

## Testing

- **Runner:** Vitest. **Component tests:** React Testing Library.
- Test **behavior the user sees**, not implementation details.
- Query by role/label/text — avoid testid unless there is no accessible alternative.
- Mock the network at the `api` layer or with MSW — never reach the real backend.
- Co-locate tests next to the unit: `Component.test.tsx`, `useThing.test.ts`.

```tsx
import { render, screen } from '@testing-library/react'
import { DriversPage } from './DriversPage'

it('shows the driver list once loaded', async () => {
  render(<DriversPage />, { wrapper: TestProviders })
  expect(await screen.findByText('João')).toBeInTheDocument()
})
```

---

## Figma Workflow

When implementing a screen from Figma:

1. Read the **real design** from the Figma URL (do not guess layout or spacing).
2. **Reuse existing components** from `components/ui/` and the design system via Code
   Connect — do not generate fresh markup for something that already exists.
3. Map Figma variables to **Tailwind tokens**, not hardcoded values.
4. Produce a component that follows every rule in this file (feature placement, typing,
   forms via shared schemas, data via TanStack Query).

---

## What NOT to Do

- Do not import anything from `backend/` — go through `shared/`.
- Do not import shared schemas via `shared/src/...` — use the `shared/schemas/*` export path.
- Do not store API data in `useState` — TanStack Query owns server state.
- Do not load data with `useEffect` + `fetch` — use `useQuery`.
- Do not call `fetch` from a component or hardcode the backend URL — use `src/lib/api.ts`.
- Do not add a client state library — React built-ins until a real need is discussed.
- Do not create a component in `components/` (shared) on first use — keep it in the feature until a second feature needs it.
- Do not add shadcn/ui components preemptively — add via the CLI only when a screen needs one.
- Do not leave a feature's components behind when the feature is deleted — remove the whole folder.
- Do not redefine form/validation types — import the Zod schema from `shared/` and `z.infer` it.
- Do not duplicate permission logic — use the CASL abilities from `shared/`.
- Do not use ability checks as real security — the backend enforces; this is UX only.
- Do not use arbitrary Tailwind values when a token exists.
- Do not use `process.env` or ship secrets in the frontend.
- Do not use `any`, `as` casts, or `@ts-ignore` to bypass TypeScript.
- Do not disable ESLint rules — fix the code.
- Do not show raw error codes or stack traces to the user — map them to friendly messages.
