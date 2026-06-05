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
join(publicDir, 'index.html')
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
