# AGENTS.md

## Project layout

Monorepo with two independent Node.js/TypeScript projects. Frontend and backend are deployed separately on Railway via Nixpacks.

```
simetrica-main/     -- Frontend: React 19 + Vite 7 + TypeScript 5.8
simetrica-Backend/  -- Backend:  Express 5 + Mongoose 8 + TypeScript 5.9
```

## Commands (run from each project root)

### Frontend (`simetrica-main/`)
| What | Command |
|------|---------|
| dev | `npm run dev` |
| typecheck + build | `npm run build`  (runs `tsc -b` then `vite build`) |
| lint | `npm run lint` |

### Backend (`simetrica-Backend/`)
| What | Command |
|------|---------|
| dev (hot reload) | `npm run dev` |
| build | `npm run build`  (`tsc`) |
| start (prod) | `npm start` |
| clean artifacts | `npm run clean` |

## Environment setup

Both projects need `.env` files. Copy `.env.example` → `.env` in each:

- **Frontend:** Sets `VITE_API_URL` (default `http://localhost:3000/api`). No other env vars needed locally.
- **Backend:** Needs `PORT`, `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_USERNAME`, `FRONTEND_URL`.

The backend auto-creates a default admin user on startup using values from the `.env` (ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_USERNAME).

## Architecture

### Backend
Layered MVC: **Routes → Controllers → Services → Mongoose Models**. All layers use class-based singletons (`export default new XController()`).

**ESM quirk:** The backend uses `"type": "module"` with Node.js ESM. All local imports **must** use `.js` extensions (e.g. `import { User } from '../models/index.js'`), even in `.ts` source files. This is enforced by `tsconfig.json` (`module: "nodenext"`).

Auth: JWT (`Authorization: Bearer <token>`), passwords hashed with bcryptjs. Token blacklist is in-memory (not persistent across restarts).

API prefix is `/api/` on all routes. Health check at `GET /health`.

### Frontend
React SPA with `BrowserRouter`. All pages use `React.lazy()` + `<Suspense>` for code splitting.

- **State:** React Context only (AuthContext for user/token). No Redux.
- **HTTP:** Mix of `axios` and native `fetch` across services. Be consistent with whatever the target service file already uses.
- **Auth token:** Stored in `localStorage`, sent via `Authorization: Bearer` header.
- **CSS:** Plain CSS files with BEM naming convention. CSS custom properties in `src/index.css` `:root`. Utility classes in `src/styles/utilities.css`. No CSS Modules, no Tailwind.
- **Route guard:** `PrivateRoute` component wraps admin routes, checks auth + optional role.

## Conventions

- All UI text, comments, and documentation is in **Spanish**.
- No tests exist (backend `test` script is a placeholder). No CI configured.
- No formatter (no Prettier). Frontend has ESLint 9 flat config; backend has no linting.
- Backend `tsconfig.json` has `skipLibCheck: true` — type-only packages (`@types/*`) issues are expected at the editor level, not blocking builds.
- The `package.json` name in the frontend has a typo: `"simetrica-fronted"` (not "frontend"). Do not "fix" this unless explicitly asked.

## Deployment

Both projects deploy via **Railway** + **Nixpacks** (Node.js 20 base image). Each has a `railway.json` and `nixpacks.toml` defining build/start commands. The frontend build script (`build.sh`) expects `VITE_API_URL` set at build time in the Railway environment.
