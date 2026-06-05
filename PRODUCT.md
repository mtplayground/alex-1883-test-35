# Suanpan

## What It Is

Suanpan is a browser-based Chinese abacus implemented as a static Vite + React
+ TypeScript app. It renders an interactive suanpan board and computes the
represented base-10 value as beads move.

## Current Capabilities

- Renders a suanpan frame with a reckoning bar and configurable rod columns.
- Models each rod with 2 heaven beads and 5 earth beads.
- Starts from a neutral zero state and supports resetting the full board.
- Lets users click or tap beads; bead groups snap toward or away from the bar
  according to suanpan activation rules.
- Displays a live numeric readout of the current board value.
- Supports responsive horizontal scrolling and touch-sized bead targets.
- Validates rod counts and bead-state consistency before model operations.

## Architecture

- Frontend-only React app; there is no backend, database, or API surface.
- Vite builds the app into static files under `dist/`.
- Tailwind CSS provides styling; ESLint and Prettier enforce code quality and
  formatting.
- Core abacus behavior lives in pure TypeScript modules under `src/model/`:
  - `suanpan.ts` defines immutable state, validation, reset, and bead toggling.
  - `value.ts` computes per-rod and full-board values.
- UI is split into focused components under `src/components/`.
- Runtime configuration is handled through Vite env variables in
  `src/config/env.ts`; `VITE_DEFAULT_ROD_COUNT` controls the default rod count.

## Testing And Validation

- Unit tests cover model behavior and value computation.
- Playwright E2E coverage verifies bead interaction, readout updates, and reset.
- Standard validation commands are:
  - `npm run lint`
  - `npm test`
  - `npm run build`
  - `npm run format:check`
  - `npm run test:e2e`

## Deployment

Suanpan is self-hostable as static assets. Run `npm run build` and serve the
contents of `dist/` from any static host, preserving the generated `assets/`
directory next to `index.html`. Deployment details are documented in
`docs/deployment.md`.
