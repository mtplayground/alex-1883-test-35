# Suanpan

## What It Is

Suanpan is a browser-based Chinese abacus implemented as a static Vite, React,
and TypeScript app. It renders an interactive suanpan board and computes the
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
- Serves the production build with a repository-owned Node static server that
  publishes `dist/index.html` and generated `dist/assets/`.

## Architecture

- Frontend-only React app; there is no backend, database, or API surface.
- Vite builds the app into static files under `dist/`.
- `npm start` runs `scripts/static-server.mjs` on `0.0.0.0:8080` by default,
  serving Vite assets and falling back to `dist/index.html` for client-side
  paths.
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
- A deploy smoke check captures raw status, headers, body, and served identity
  for both the exact live URL and the configured publish target. It fails if
  either response is a placeholder or platform-owned route instead of the
  Suanpan Vite build.
- Deploy issue closure requires a maintainer to load the live URL and visually
  confirm the Suanpan beads, rods, and readout are rendered; automated checks
  alone are not sufficient.
- Standard validation commands are:
  - `npm run lint`
  - `npm test`
  - `npm run build`
  - `npm run format:check`
  - `npm run test:e2e`
  - `DEPLOYED_URL=<url> npm run smoke:deploy`

## Deployment

Suanpan is self-hostable as static assets. Run `npm run build` and serve the
contents of `dist/` with `npm start` or an equivalent static host, preserving
the generated `assets/` directory next to `index.html`. After deployment, run
`npm run smoke:deploy` with `DEPLOYED_URL` or `SMOKE_BASE_URL` pointed at the
exact URL users open. `PUBLISHED_URL` or `PUBLISHED_PATH` can override the
publish target checked by the smoke test. Deployment details and the release
checklist are documented in `docs/deployment.md`.

The current live Sprite investigation is documented in
`docs/live-serving-contract.md`: previous live responses mapped to a
platform-owned route rather than Suanpan, and the corrected contract is that the
viewed URL returns the Vite build entrypoint with its generated assets.
