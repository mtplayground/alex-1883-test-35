# Static deployment

Suanpan builds to static files that can be served by any static web host.

## Build

Install dependencies and create the production bundle:

```bash
npm ci
npm run build
```

The generated site is written to `dist/`.

## Verify locally

Preview the production bundle on the same host and port used by the app:

```bash
npm run preview
```

Open `http://localhost:8080` to verify the static output.

## Verify after deploy

Run the deploy smoke check against the deployed root URL before marking a
deployment healthy:

```bash
DEPLOYED_URL=https://example.com npm run smoke:deploy
```

The check fails if the served root contains the old `DEPLOYMENT READY` /
`Sprite service` placeholder text, or if the rendered page does not expose the
Suanpan abacus board.

## Host the bundle

Upload the complete contents of `dist/` to a static host. The deployment must
preserve the `assets/` directory next to `index.html`.

Example static-server command:

```bash
npx serve dist
```

Suanpan is a client-side app without server routes or a database. Hosts with
single-page app fallback settings can route unknown paths to `index.html`,
though the current app only requires the root path.

## Configuration

Build-time Vite variables are read from the environment. Set
`VITE_DEFAULT_ROD_COUNT` before `npm run build` to change the default board
size for a deployment:

```bash
VITE_DEFAULT_ROD_COUNT=13 npm run build
```
