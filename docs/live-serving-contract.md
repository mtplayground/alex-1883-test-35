# Live serving contract finding

Issue: #31, "Diagnose the live serving contract and why the placeholder wins"

Live Sprite checked: `alex-1883-test-35-8c5fab`

Live URL checked: `https://alex-1883-test-35-8c5fab-bp4af.sprites.app/`

## Served root path

The Sprite service named `app` is registered with:

- command: `/opt/app/start-app.sh`
- HTTP port: `8080`

`/opt/app/start-app.sh` exports `PORT=8080` and runs:

```sh
exec node /opt/app/server.js
```

`/opt/app/server.js` resolves its static root from its own directory:

```js
const root = fileURLToPath(new URL('.', import.meta.url));
const publicDir = join(root, 'public');
```

For `GET /`, it serves:

```js
join(publicDir, 'index.html');
```

Therefore the live served root entrypoint is:

```text
/opt/app/public/index.html
```

## Required entrypoint

The Suanpan app in this repository is a Vite static app. Its source entrypoint
is the repository root `index.html`, which loads `/src/main.tsx` during
development. The production build contract in `vite.config.ts` is:

```text
outDir: dist
assetsDir: assets
```

After `npm run build`, the static host must publish the contents of `dist/`.
The required production entrypoint for the live Sprite is:

```text
/opt/app/dist/index.html
```

with the generated `assets/` directory preserved next to it.

## Conflicting placeholder source

The placeholder wins because the live Sprite is not serving the repository's
Vite build output. It is running a leftover Node static server from `/opt/app`
that serves `/opt/app/public/index.html` for `/`.

That conflicting placeholder file contains the old default content:

```text
Deployment ready
myClawTeam user app is online
The Sprite service is serving a real HTTP response with static assets and health checks.
```

The live `/opt/app` tree also has no `dist/` directory and no uploaded Suanpan
source; its `package.json` only declares `start: node server.js`. This is a
wrong publish target / leftover default app problem rather than a Suanpan
runtime failure.

## Corrected mapping

Issue #33 rechecked the exact viewed URL:

```text
https://alex-1883-test-35-8c5fab-bp4af.sprites.app/
```

The raw response at that URL returned `200 OK` with Sprite/Fly headers and an
HTML page loading `/app.js` plus `/styles.css`, which identifies it as a
platform-owned page/route rather than the Suanpan Vite build. It did not serve
the Suanpan `dist/index.html` entrypoint or generated `dist/assets/` files.

The fix reconciles the exact viewed URL with the publish target by making the
repository's production start command serve the Vite build output directly:

```text
npm start -> node scripts/static-server.mjs -> /opt/app/dist/index.html
```

The corrected host mapping is:

- Exact viewed URL: the user-opened Sprite URL, including any path.
- Publish target: `/` on the same origin unless deployment supplies
  `PUBLISHED_URL` or `PUBLISHED_PATH`.
- Served identity: Suanpan Vite build, detected by the `Suanpan` HTML title and
  generated `/assets/*.js` entrypoint.
- Corrected route: both the exact viewed URL and the publish target return
  `dist/index.html`; generated files under `dist/assets/` are served next to it.

`scripts/deploy-smoke.mjs` records each raw HTTP response as
`ISSUE_33_RESPONSE` with status, headers, body, URL, and served identity, then
prints `ISSUE_33_MAPPING` to document whether the exact viewed URL and publish
target agree.
