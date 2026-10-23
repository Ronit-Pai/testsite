# TaskFlow — Nexathon Sample App

A small Next.js + TypeScript sample target for demonstrating Nexathon incident detection and remediation.

## Requirements

- Node.js 20.9 or later
- npm
- A Vercel account for deployment

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

## API endpoints

- `GET /api/health` — health response
- `GET /api/tasks` — task list; main controller probe
- `GET /api/tasks/summary` — counts by task status

Check the APIs:

```bash
curl -i http://localhost:3000/api/health
curl -i http://localhost:3000/api/tasks
curl -i http://localhost:3000/api/tasks/summary
```

## Demo fault modes

Set `DEMO_FAULT_MODE` in `.env.local`, then restart the dev server:

- `healthy` — routes return successful responses (default)
- `runtime` — `/api/health` and `/api/tasks` return HTTP 500; use this to rehearse a fresh regression
- `persistent` — `/api/tasks` returns HTTP 500; use this on both compared revisions to rehearse a persistent defect

Example:

```dotenv
DEMO_FAULT_MODE=runtime
```

These are demo-only fault switches. Never enable them on an unrelated or real production project. Do not expose a public query parameter or unauthenticated control that can break production.

For the most realistic rollback demo, prefer separate Git commits:
1. Deploy healthy code and save its immutable deployment URL.
2. Commit a deliberate route failure and deploy it.
3. Let the local controller compare current and previous immutable deployment URLs.
4. Roll back only if the current production deployment is the allowlisted demo project, the predecessor passes the same probe, and the controller's other guards pass.

Note: environment-variable changes on Vercel generally require a new deployment. Ensure the demo configuration is consistent across the deployments being compared.

## Deploy to Vercel

1. Push this project to a GitHub repository.
2. In Vercel, import that repository.
3. If this folder is inside the Nexathon monorepo, set the Vercel **Root Directory** to `apps/sample`.
4. Deploy with `DEMO_FAULT_MODE=healthy` (or leave it unset).
5. Test `/api/health` and `/api/tasks` on the deployed URL.

## Safety

- Keep the controller local and bind its API to localhost for the demo.
- Keep Vercel rollback credentials in the controller only.
- Do not commit real `.env` files, API tokens, or webhook URLs.
- The sample app contains no production data and no user authentication.
