# CLAUDE.md — Mobile (Expo)

This file defines the architecture, conventions, and patterns of the **mobile app**.
Read this before writing any component, hook, screen, or suggesting any structure.

The backend has its own `CLAUDE.md` at the project root. This file covers `mobile/` only.

---

## Project Type

Mobile application built with **Expo** and **Expo Router** (file-based routing,
built on top of React Navigation).
It is a pure client: it runs on the device (iOS/Android) and talks to the
Express backend over HTTP. There is **no backend logic here** — the backend
already exists.

---

## Monorepo Position

```
root/
├── backend/   → Express API (out of scope here)
├── mobile/    → this package (Expo)
└── shared/    → Zod schemas + CASL abilities + cross-boundary types
```

The app depends on `shared` as a workspace package (`"shared": "workspace:*"`).
`shared/` is the **only** bridge between the app and the backend.

**Never import from `backend/`.** If the app needs a type or schema that the
backend also uses, it lives in `shared/`.

### Importing from shared

`shared/package.json` exposes schemas through its `exports` map. The correct import
path is `shared/schemas/<file>` — **not** `shared/src/schemas/<file>`.

```typescript
import { registerDriverSchema } from 'shared/schemas/auth'
```

---

## Stack

- **Framework:** Expo (React Native)
- **Language:** TypeScript
- **Routing:** Expo Router (file-based, built on React Navigation)
- **Styling:** NativeWind (Tailwind syntax, compiled to native StyleSheet)
- **Server state / data fetching:** TanStack Query (`@tanstack/react-query`)
- **Client state:** React built-ins (`useState`, `useReducer`, Context) — no state library yet
- **Forms:** React Hook Form + Zod (schemas from `shared/`)
- **Validation:** Zod (single source of truth, imported from `shared/`)
- **Permissions:** CASL (abilities from `shared/`)
- **HTTP client:** a single typed `fetch` wrapper in `src/lib/api.ts`
- **Real-time:** Socket.io (status updates, not covered by TanStack Query)
- **Secure storage:** `expo-secure-store` (auth tokens)
- **Test runner:** Vitest
- **Component testing:** React Native Testing Library

---

## Folder Structure

```
mobile/
├── app/                              → routes (Expo Router — file name = route)
│   ├── (auth)/
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (client)/
│   │   ├── _layout.tsx               → role gate (CASL) for the client area
│   │   ├── home.tsx
│   │   ├── new-delivery.tsx
│   │   └── delivery/[id].tsx
│   ├── (driver)/
│   │   ├── _layout.tsx               → role gate (CASL) for the driver area
│   │   ├── home.tsx
│   │   ├── active-delivery.tsx
│   │   └── earnings.tsx
│   └── _layout.tsx                   → root layout, routes the logged-in user
├── src/
│   ├── lib/
│   │   ├── api.ts                    → single typed fetch wrapper
│   │   ├── queryClient.ts
│   │   └── socket.ts
│   ├── components/
│   │   ├── ui/                       → hand-written primitives (no shadcn on RN)
│   │   └── [Shared]/                 → shared by 2+ features
│   ├── features/
│   │   ├── auth/
│   │   ├── deliveries/                → client-side delivery flow
│   │   ├── driver-deliveries/         → driver-side delivery flow
│   │   ├── tracking/                  → MVP: status updates only, no map/geolocation yet
│   │   ├── documents/                 → driver document upload (CNH, selfie, address proof)
│   │   ├── payments/
│   │   └── ratings/
│   │       ├── components/
│   │       ├── hooks/
│   │       └── api.ts                 → no "Page/Screen" file — the screen lives in app/
│   ├── hooks/                        → cross-feature hooks (e.g. useAuth, useAbility)
│   ├── providers/                    → AuthProvider, AbilityProvider, etc.
│   └── test/
│       └── setup.ts
└── package.json
```

**Feature-based, mirroring the backend.** A screen's supporting logic lives under
`src/features/[feature]/`; the screen component itself lives in `app/`, since Expo Router
requires it there to become a route. The `app/` file imports hooks and components from
`src/features/[feature]/`.

```tsx
// mobile/app/(client)/new-delivery.tsx
import { useCreateDelivery } from '../../src/features/deliveries/hooks/useCreateDelivery'

export default function NewDeliveryScreen() {
  const { mutate } = useCreateDelivery()
  // ...
}
```

```typescript
// mobile/src/features/deliveries/hooks/useCreateDelivery.ts
import { useMutation } from '@tanstack/react-query'
import { createDelivery } from '../api'

export function useCreateDelivery() {
  return useMutation({ mutationFn: createDelivery })
}
```

---

## Component Lifecycle

Components are the thing that rots fastest in a frontend. To avoid a graveyard of unused
files, **every component has a defined home and a defined death.** There are three zones,
each with a different lifecycle:

| Zone | What lives here | When it is created | When it dies |
|---|---|---|---|
| `src/components/ui/` | Custom primitives (Button, Input, Dialog, built with NativeWind) | Written by hand **only when a real screen needs it** — never "just in case" | Almost never (these are the base) |
| `src/features/[feature]/components/` | A component used by **one** feature only | Freely — this is the default home | **With the feature.** Delete the feature, delete the folder |
| `src/components/` | A component shared by **2+ features** | Only on the **second** real use | When no feature imports it anymore |

### Rules

- **Rule of two** — never create a component in `src/components/` (shared) on its first
  use. Keep it inside the feature. Promote it only when a **second** feature genuinely
  needs it.
- **A component travels with its feature** — deleting a screen/feature removes its code
  automatically.
- **No component CLI** — unlike shadcn on web, RN primitives are hand-written. Write the
  minimum needed for the screen in front of you, not a full design system upfront.
- **Delete with the feature** — when a feature is removed, delete its entire folder
  (`components/`, `hooks/`, `api.ts`) **and** the matching route file(s) in `app/`.
- **Figma reuses, never duplicates** — same principle, applied to whatever design tool
  feeds the mobile screens.

---

## Data Fetching — TanStack Query owns server state

Everything that comes from the backend is **server state** and is managed by TanStack
Query. **Never** store API responses in `useState` and sync them by hand.

### The three layers

1. `src/features/[feature]/api.ts` — plain async functions that call `api` and return typed data.
2. `src/features/[feature]/hooks/` — wrap those functions in `useQuery` / `useMutation`.
3. The screen, in `app/` — calls the hook, reads `data` / `isLoading` / `error`. No fetching logic inside JSX.

### Rules

- **Query keys** are arrays starting with the resource name: `['deliveries']`, `['deliveries', id]`.
- **Mutations** invalidate the relevant query keys on success — do not refetch manually.
- **No `useEffect` + `fetch`** to load data. If you reach for that, you want `useQuery`.
- Types for responses come from `shared/` when they cross the API boundary.

### Real-time updates (Socket.io) are NOT TanStack Query

Status changes that arrive unprompted from the server (delivery accepted, driver location
update, status transition) come through Socket.io, not `useQuery`. The pattern:

1. A socket listener updates the relevant TanStack Query cache directly via
   `queryClient.setQueryData()` — never a parallel `useState`.
2. This keeps a single source of truth — the UI always reads from TanStack Query,
   it just gets updated by two different triggers (a fetch, or a socket event).
3. The listener lives in a dedicated hook (e.g. `useDeliveryTracking`), separate from
   the `useQuery` hook that does the initial fetch — each hook has one job.

```typescript
// src/features/deliveries/hooks/useDeliveryTracking.ts
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { socket } from '../../../lib/socket'

export function useDeliveryTracking(deliveryId: string) {
  const queryClient = useQueryClient()

  useEffect(() => {
    function handleStatusUpdate(newStatus: string) {
      queryClient.setQueryData(['deliveries', deliveryId], (old: any) => ({
        ...old,
        status: newStatus,
      }))
    }

    socket.on(`delivery:${deliveryId}:status`, handleStatusUpdate)
    return () => socket.off(`delivery:${deliveryId}:status`, handleStatusUpdate)
  }, [deliveryId, queryClient])
}
```

---

## Client State — React built-ins first

State that does **not** come from the API (theme, open/closed menu, multi-step form
progress, current auth session) uses `useState`, `useReducer`, or Context.

**Do not add a state library (Zustand, Redux, etc.).** With TanStack Query handling
server state, very little global client state remains. If a real need appears, stop and
discuss it before adding a dependency.

- Local UI state → `useState` in the component.
- State shared across a subtree → Context provider in `src/providers/`.
- Auth session and ability live in Context (`AuthProvider`, `AbilityProvider`).
- **Role-based routing** (client vs driver) reads from `AuthProvider` — the `_layout.tsx`
  files in `app/(client)/` and `app/(driver)/` check the current user's role there,
  not from a separate state source.

---

## Forms — React Hook Form + Zod from shared

The form schema is **never** redefined in the mobile app. Import it from `shared/` — the
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
- Field-level errors come from `form.formState.errors`, rendered next to each `TextInput`.
- The submit handler calls a TanStack Query **mutation**, never `fetch` directly.
- **File uploads** (driver documents: CNH photo, selfie, proof of address) use
  `expo-image-picker` / `expo-document-picker` to get a local URI, then the mutation
  sends it as `multipart/form-data` — same `documents` schema validated in `shared/`.

---

## Permissions — CASL from shared

Permission rules live in `shared/abilities/`. The app builds an ability from the
current user and uses it to **show/hide UI and gate navigation**. This is a UX layer
only — the backend still enforces every rule.

```typescript
import { defineAbilityFor } from 'shared/abilities/user'

const ability = defineAbilityFor(currentUser)

{ability.can('edit', 'Driver') && <EditButton />}
```

### Rules

- Build the ability once and expose it via `AbilityProvider` / a `useAbility()` hook.
- Use ability checks to **conditionally render** actions — never to "secure" anything.
- Never duplicate permission logic in the app — the rule lives in `shared/`.
- **Route gating**: `app/(client)/_layout.tsx` and `app/(driver)/_layout.tsx` each check
  `ability.can('access', 'ClientArea')` / `ability.can('access', 'DriverArea')` before
  rendering their child routes, redirecting to the other area (or to login) otherwise.
  This is the mechanism behind the role-based routing from the Client State section.

---

## Styling — NativeWind

- Style with **Tailwind-syntax utility classes** directly on components, via `className`
  (NativeWind compiles this to native `StyleSheet` under the hood — this is not CSS
  running in a browser).
- Build primitives from scratch in `src/components/ui/` (Button, Input, Card, etc.) —
  there is no shadcn/ui for React Native. These are owned by us from day one.
- **Use design tokens, not magic values.** Prefer the Tailwind theme scale (`p-4`,
  `text-muted-foreground`) over arbitrary values (`p-[13px]`, `text-[#3a3a3a]`).
  New tokens go in `tailwind.config.js`, shared across the whole app.
- For conditional classes use the project's `cn()` helper (clsx + tailwind-merge) — same
  helper as the frontend used, works identically here.
- **No cascade, no pseudo-classes.** Unlike web Tailwind, there is no `hover:` (no mouse
  on a phone) and no inherited text styles from a parent `<Text>` — every `<Text>` needs
  its own className. Interaction states (pressed, disabled) come from the component's own
  props (e.g. `Pressable`'s `onPressIn`/`onPressOut`), not from a CSS pseudo-class.

```tsx
<Pressable
  className={cn('rounded-md px-4 py-2', isActive && 'bg-primary')}
  onPress={handlePress}
>
  <Text className="text-white">Confirm</Text>
</Pressable>
```

---

## API Client

A single typed wrapper in `src/lib/api.ts` is the only place that knows the base URL,
attaches the auth token, and maps backend error codes.

- Base URL comes from `process.env.EXPO_PUBLIC_API_URL`.
- It attaches the Bearer access token, read via `expo-secure-store` (never AsyncStorage —
  tokens are sensitive and must be encrypted at rest).
- It reads the backend's `{ error: code }` shape and throws a typed error the UI can map.
- Feature `api.ts` files call this wrapper — they never call `fetch` directly.

**Never** hardcode the backend URL or call `fetch` from a component.
**Never** store access or refresh tokens in AsyncStorage — always `expo-secure-store`.

---

## Error Handling

The backend returns `{ error: ERROR_CODE }`. The app maps codes to user-facing
messages — it never shows raw codes or stack traces to the user.

- Keep a single map from `ErrorCode` → friendly message (pt-BR) in `src/lib/errorMessages.ts`.
- Query/mutation errors render an error state or toast using that map.
- Unknown errors fall back to a generic message — never leak internals.
- **Offline/network errors** get their own message (e.g. "sem conexão, tentando de novo")
  instead of falling into the generic bucket — mobile connectivity drops far more often
  than a browser tab does (driver on the road, weak signal).

---

## Environment Variables

- Expo exposes only variables prefixed with `EXPO_PUBLIC_`.
- Access via `process.env.EXPO_PUBLIC_*`.
- Required vars are documented in `mobile/.env.example`.
- **Never** put secrets in the app — anything prefixed `EXPO_PUBLIC_` ships inside the
  compiled binary and can be extracted by anyone with the `.apk`/`.ipa`. Treat it exactly
  like "ships to the browser" from the web version — same rule, same reasoning.
- API keys for third-party services with a **server-side counterpart** (Google Maps,
  Stripe/Mercado Pago) live in the backend `.env`, never here. The app only holds
  keys explicitly meant to be public (e.g. a Maps key restricted by bundle ID, if used
  client-side for rendering).

---

## Code Conventions

### Naming

- Variables, functions, hooks → `camelCase` in English (hooks start with `use`)
- Components, types → `PascalCase` in English
- Component files → `PascalCase.tsx`; non-component files → `camelCase.ts`
- Global constants → `UPPER_SNAKE_CASE` in English
- Route paths (Expo Router file names) → English kebab-case (`new-delivery.tsx`,
  never `nova-entrega.tsx`) — the file name becomes the URL/deep-link segment
- Design tokens → English kebab-case (`--color-accent-blue`, never `--color-azul-detalhes`)

**Every identifier in the codebase is in English — no exceptions.** The only Portuguese
allowed is **user-facing copy** (text rendered on screen, accessibility labels, placeholders).

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

---

## Testing

- **Runner:** Vitest. **Component tests:** React Native Testing Library.
- Test **behavior the user sees**, not implementation details.
- Query by role/label/text (`getByText`, `getByRole`) — avoid testID unless there is no
  accessible alternative.
- Mock the network at the `api` layer or with MSW — never reach the real backend.
- Co-locate tests next to the unit: `Component.test.tsx`, `useThing.test.ts`.
- Screens inside `app/` that use Expo Router hooks (`useLocalSearchParams`, `useRouter`)
  need those mocked or wrapped — test the underlying screen component directly when
  possible, rather than fighting the router in the test.

```tsx
import { render, screen } from '@testing-library/react-native'
import { DeliveryScreen } from '../../src/features/deliveries/DeliveryScreen'

it('shows the delivery status once loaded', async () => {
  render(<DeliveryScreen deliveryId="123" />, { wrapper: TestProviders })
  expect(await screen.findByText('A caminho')).toBeTruthy()
})
```

---

## Figma Workflow

When implementing a screen from Figma:

1. Read the real design from the Figma URL (do not guess layout or spacing). Frames are
   already sized for mobile — dimensions and spacing should map close to 1:1, unlike a
   desktop-to-mobile adaptation.
2. Reuse existing components from `src/components/ui/`. There is no Code Connect / shadcn
   equivalent yet — check `src/components/ui/` by hand for something matching before
   writing a new primitive.
3. Map Figma variables to **NativeWind tokens** in `tailwind.config.js`, not hardcoded
   values (`p-[13px]`, `text-[#3a3a3a]`).
4. Produce a route file in `app/` plus supporting logic in `src/features/[feature]/`,
   following every rule in this file (feature placement, typing, forms via shared
   schemas, data via TanStack Query).

---

## What NOT to Do

- Do not import anything from `backend/` — go through `shared/`.
- Do not import shared schemas via `shared/src/...` — use the `shared/schemas/*` export path.
- Do not store API data in `useState` — TanStack Query owns server state.
- Do not load data with `useEffect` + `fetch` — use `useQuery`.
- Do not sync socket events into a parallel `useState` — write into the TanStack Query
  cache via `queryClient.setQueryData()`.
- Do not call `fetch` from a component or hardcode the backend URL — use `src/lib/api.ts`.
- Do not add a client state library — React built-ins until a real need is discussed.
- Do not create a component in `src/components/` (shared) on first use — keep it in the
  feature until a second feature needs it.
- Do not leave a feature's components behind when the feature is deleted — remove the
  whole folder in `src/features/` **and** the matching route file(s) in `app/`.
- Do not redefine form/validation types — import the Zod schema from `shared/` and
  `z.infer` it.
- Do not duplicate permission logic — use the CASL abilities from `shared/`.
- Do not use ability checks as real security — the backend enforces; this is UX only.
- Do not use arbitrary NativeWind values when a token exists.
- Do not use `process.env.VITE_*` or any web-only env access — Expo uses
  `process.env.EXPO_PUBLIC_*`.
- Do not store access/refresh tokens in AsyncStorage — always `expo-secure-store`.
- Do not put a secret or a server-only API key behind `EXPO_PUBLIC_*` — it ships inside
  the compiled binary.
- Do not use `any`, `as` casts, or `@ts-ignore` to bypass TypeScript.
- Do not disable ESLint rules — fix the code.
- Do not show raw error codes or stack traces to the user — map them to friendly messages.
- Do not assume Tailwind web behavior (cascade, `hover:`, inherited text styles) exists
  in NativeWind — style every element explicitly.