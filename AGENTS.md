# DMIT Facturador — Agent Guide

## Stack
- Vue 3.5 + TypeScript 4.7 + Vite 4
- Pinia (composition stores) for state, Vue Router 4, Axios
- Ant Design Vue 3 + vue3-styled-components (Less theme vars)
- jsPDF/html2canvas (PDF), exceljs (Excel), TanStack Query, ApexCharts, Chart.js

## Dev commands (ordered)
```sh
npm install        # npm only (no pnpm/yarn)
npm run dev        # vite --mode development
npm run lint       # eslint . --ext .vue,.js,.ts,.tsx,.cjs,.mjs --fix
npm run type-check # vue-tsc --noEmit  (required before build)
npm run build      # run-p type-check build-only
npm run build-only # vite build --mode production (skips type-check, terser drops console/debugger)
npm run build:dev  # vite build --mode development (for Dev Dockerfile)
npm run preview    # vite preview
```

## Architecture
- **`src/api/`** — one file per domain (`invoice-api.ts`, `login-api.ts`, etc.), Axios-based, all use `ApiHttp` from `base-api.ts` which auto-attaches OAuth Bearer token
- **`src/app/store/`** — Pinia stores with `useXxxStore` naming, composition API (`defineStore('xxx', () => { ... })`)
- **`src/app/pages/`** — view/page components (one per route)
- **`src/app/router/`** — route defs split across `adminRoutes.ts`, `authRoutes.ts`, `customer.ts`, etc.
- **`src/api-email-sender/`** / **`src/api-reports/`** — separate Axios clients for microservices (different base URLs)
- **`src/config/theme/`** — Ant Design Less theme variables (imported in `vite.config.ts` via `modifyVars`)
- **`src/app/pdf/`** / **`src/app/excel/`** — PDF/Excel generation logic

## Auth flow
OAuth2 password grant with Laravel backend (`/oauth/token`). Token stored in Pinia `user-store.ts`, injected via Axios request interceptor in `base-api.ts`. Also supports Auth0 Lock (CDN) and Google Login.

## API conventions
- All API functions in `src/api/*` are async, receive params, build `URLSearchParams`, call `ApiHttp.get/post`, return `AxiosResponse`
- Base URL from `VITE_URL_BASE_API` env var: `http://localhost:7000` (dev), `https://api.dmit.ar` (prod)
- Separate Axios clients for reports (`VITE_API_REPORTS_URL`) and email sender (`VITE_API_EMAIL_SENDER_URL`)

## Key conventions
- Indent: 4 spaces (ESLint + Prettier)
- Single quotes, trailing commas, printWidth 120
- No directory `src/router/` — router lives in `src/app/router/`
- `@/` alias maps to `src/`
- Vue components: `<script setup lang="ts">`, Composition API
- Error logging uses emoji-prefixed `console.log` (not `console.error`)
- No tests — no test framework configured

## Docker
```sh
# Dev (uses Dockerfile__, .env.development, nginx on port 3131)
docker compose -f docker-compose-dev.yml up --build
# Production (uses Dockerfile, .env.production, nginx on port 3131)
docker compose -f docker-compose-production.yml up --build
```
Both expect `dmit_network` external Docker network.

## Gotchas
- `Dockerfile__` (double underscore) is the dev Dockerfile — not a typo
- `build-only` skips type-checking (fast but risky)
- `tsconfig.json` has no `strict: true`; target is `es2017`
- `unplugin-vue-components` auto-imports Ant Design Vue components (no manual import needed)
- No `.github/` directory — no CI/CD present
- `.env.*` files are gitignored but committed (contains dev API keys)
