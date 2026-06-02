# Artemis Staff — Admin Dashboard

Internal staff/admin console for Artemis. Surfaces business & product metrics
(growth, acquisition, engagement, product funnels, quality) and a user-management
directory with resume download.

## Stack

- Vite + React 18 + TypeScript
- TanStack Query (server state), zustand (auth), axios (API client)
- Tailwind CSS + Radix + lucide-react
- recharts (charts)
- react-router-dom

## Backend

Talks to the existing `ArtemisBev2` Express API under `/admin/*` (gated by
`requireAuth` + `requireAdmin`). In dev, Vite proxies `/api -> http://localhost:4000`.

Admin access is granted server-side via the `ADMIN_EMAILS` env var on the backend
(comma-separated allow-list). Sign in with an authorized admin account.

## Scripts

```bash
npm install
npm run dev        # http://localhost:5273
npm run build      # tsc -b && vite build
npm run typecheck
```

## Configuration

Copy `.env.example` to `.env.local` and adjust `VITE_API_BASE_URL` if not using
the dev proxy.

## Pages

- `/login` — admin sign-in
- `/` — Overview KPIs
- `/acquisition` — activation funnel + daily signups
- `/engagement` — DAU/WAU/MAU + voice adoption
- `/product` — CV / interview / application status funnels
- `/quality` — analysis reliability + finding feedback
- `/users` — searchable user directory
- `/users/:id` — user detail + resume download
