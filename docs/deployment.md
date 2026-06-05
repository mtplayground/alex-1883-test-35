# Static deployment

Suanpan builds to static files that can be served by any static web host.

## Build

Install dependencies and create the production bundle:

```bash
npm ci
npm run build
```

The generated site is written to `dist/`.

## Release checklist

Before any deploy issue is marked done, complete every item below:

- Build the production bundle with `npm run build`.
- Deploy the generated `dist/index.html` and `dist/assets/` files to the live
  host.
- Run `DEPLOYED_URL=<live-url> npm run smoke:deploy` against the exact URL a
  user opens.
- Have a maintainer load that same live URL in a browser and visually confirm
  the Suanpan board renders with beads, rods, and the numeric readout.
- Confirm the live URL is not a platform-owned page or route, including any page
  branded as "myClawTeam".
- Record the maintainer name, live URL, and confirmation time in the deploy
  issue before closing it.

The automated smoke check is required, but it is not sufficient on its own. A
deploy issue may only be closed after the human visual confirmation is recorded.

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

`DEPLOYED_URL` is the exact URL a user opens. The check also fetches the publish
target, which defaults to `/` on the same origin and can be overridden with
`PUBLISHED_URL` or `PUBLISHED_PATH`. It logs the raw status, headers, and body
for both responses, classifies whether each response is the Suanpan Vite build
or a platform-owned placeholder, and records the expected corrected mapping:
the viewed URL must return `dist/index.html` with the generated `assets/`
directory. The check fails if either response contains the old
`DEPLOYMENT READY` / `Sprite service` placeholder text, or if the rendered page
does not expose the Suanpan abacus board. A passing smoke check prints the
human verification gate reminder, but the deploy issue must remain open until a
maintainer completes and records the visual confirmation from the release
checklist.

## Host the bundle

Upload the complete contents of `dist/` to a static host. The deployment must
preserve the `assets/` directory next to `index.html`.

Example static-server command:

```bash
npm start
```

`npm start` runs the repository's Node static server on `0.0.0.0:8080` by
default, or on the `HOST` / `PORT` supplied by the host. It serves the generated
`dist/index.html` for the root and client-side fallback paths, and serves
`dist/assets/` as immutable static assets. Suanpan is a client-side app without
server routes or a database.

## Configuration

Build-time Vite variables are read from the environment. Set
`VITE_DEFAULT_ROD_COUNT` before `npm run build` to change the default board
size for a deployment:

```bash
VITE_DEFAULT_ROD_COUNT=13 npm run build
```
