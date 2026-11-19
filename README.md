# GoShop

GoShop is a cross-platform grocery e-commerce application. It consists of an
Expo / React Native client (iOS, Android and web) and a Go REST API backed by
PostgreSQL. The app covers browsing a grocery catalog, cart and checkout flows,
authentication, delivery location, payment methods, orders and account settings.

---

## Table of contents

1. [System overview](#1-system-overview)
2. [Current implementation status](#2-current-implementation-status)
3. [Architecture](#3-architecture)
4. [Technology stack](#4-technology-stack)
5. [Repository structure](#5-repository-structure)
6. [Prerequisites](#6-prerequisites)
7. [Quick start](#7-quick-start)
8. [Configuration](#8-configuration)
9. [Frontend](#9-frontend)
10. [Backend](#10-backend)
11. [API reference](#11-api-reference)
12. [Data model](#12-data-model)
13. [Commands reference](#13-commands-reference)
14. [Testing](#14-testing)
15. [Deployment](#15-deployment)
16. [Security](#16-security)
17. [Known limitations and caveats](#17-known-limitations-and-caveats)
18. [Roadmap](#18-roadmap)
19. [License](#19-license)

---

## 1. System overview

```text
┌───────────────────────────────────────┐
│  Expo client (iOS / Android / Web)    │
│  - Expo Router file-based navigation  │
│  - React Context state stores         │
│  - Typed fetch client (api.ts)        │
└──────────────────┬────────────────────┘
                   │ HTTPS + JSON, Bearer access token
                   │ EXPO_PUBLIC_API_URL → /api/v1
                   ▼
┌───────────────────────────────────────┐
│  Go API (stateless HTTP service)      │
│  - chi router + middleware            │
│  - bcrypt passwords, JWT + refresh    │
│  - startup SQL migrations             │
└──────────────────┬────────────────────┘
                   │ pgxpool, parameterized SQL
                   ▼
┌───────────────────────────────────────┐
│  PostgreSQL 16 (Docker volume)        │
│  - users, refresh_tokens              │
└───────────────────────────────────────┘
```

The client talks only to the API. The API is the only component that connects
to PostgreSQL; no database credentials, JWT secrets or payment secrets live in
the app bundle. The server is designed as a modular monolith and is stateless,
so it can be scaled horizontally.

---

## 2. Current implementation status

| Area | Status | Notes |
|---|---|---|
| App shell, routing, theming, navigation | Implemented | Expo Router with typed routes, light/dark themes, native/web tab variants |
| Login / signup screens | Implemented | Wired to the live Go auth API |
| Auth API (register, login, refresh, logout, me) | Implemented | JWT access tokens + rotating refresh tokens |
| Health probes | Implemented | `/health/live`, `/health/ready` |
| Database + migrations | Implemented | PostgreSQL 16, ordered startup migration runner |
| Docker / Compose | Implemented | Postgres + API services, multi-stage Dockerfile |
| Product catalog | Frontend prototype | 18 hard-coded products, 7 categories in `src/data/products.ts` |
| Cart | Frontend prototype | In-memory React state, seeded with 3 items |
| Orders / order tracking | Frontend prototype | Hard-coded order data and locally generated order IDs |
| Checkout / delivery | Frontend prototype | Fixed totals; real map via OpenStreetMap tiles + Nominatim + `expo-location` |
| Payment methods | Frontend prototype | Seeded cards and mobile money (MTN, Airtel, M-Pesa, Orange) |
| Language selection | UI only | 8-language picker; strings are not translated |
| Catalog, addresses, orders, payments API | Not implemented | Documented in `backendimpl.md` (the original backend plan) |

> `backendimpl.md` in the repository root is the original design guide and
> implementation plan. Parts of it are now outdated (for example it describes
> the frontend as a pure prototype, proposes `cmd/migrate` and `goose`, and
> shows a different Compose file). This README describes the code as it exists.

---

## 3. Architecture

### Frontend layers

- **Routes** (`src/app`): Expo Router file-based screens and layouts. The root
  layout composes the providers and enforces auth-based redirects.
- **Components** (`src/components`): reusable UI (product cards, form fields,
  carousel, headers, settings rows, animated icon, platform-specific tabs).
- **Stores** (`src/store`): React Context providers for auth, cart, theme,
  language and payment methods.
- **Services** (`src/services/api.ts`): the single typed HTTP client. It
  requires `EXPO_PUBLIC_API_URL`, applies a 15-second timeout with
  `AbortController`, sends bearer tokens, unwraps `{ data }` responses and
  throws `ApiError` with the server's `{ error: { code, message } }` details.
- **Data/constants** (`src/data`, `src/constants`): demo catalog and theme
  tokens.

### Backend layers

- `cmd/api/main.go`: config loading, DB connect, migrations, HTTP server with
  timeouts, graceful shutdown on SIGINT/SIGTERM.
- `internal/config`: validates required environment variables.
- `internal/database`: `pgxpool` setup (max 20 connections, startup ping) and
  the ordered `.sql` migration runner (`schema_migrations` table).
- `internal/httpapi`: chi router, middleware (request ID, real IP, recoverer,
  CORS allowlist), handlers, DTOs and error mapping. 1 MB request body limit and
  `DisallowUnknownFields`.
- `internal/auth`: password hashing, JWT issuing/verification, refresh-token
  creation, hashing, rotation and revocation.
- `db/migrations`: ordered SQL schema files.

### Authentication flow

1. `POST /auth/register` or `/auth/login` returns an access token (HS256 JWT,
   15-minute expiry, issuer `goshop-api`) and a refresh token (32 random bytes,
   base64url, 30-day expiry).
2. Access tokens are kept **in memory** in `AuthProvider`. Only the refresh
   token is persisted — in `expo-secure-store` on iOS/Android when "remember
   me" is selected (always for registration), and memory-only on web.
3. On app start, a stored refresh token is exchanged for a new session.
4. `authenticatedRequest()` retries once after a 401 by rotating the refresh
   token. Concurrent 401s share a single in-flight refresh (single-flight).
5. On 401/403 during refresh, local credentials are cleared. Logout revokes
   the refresh token server-side and clears local state.

Server-side, refresh tokens are stored only as SHA-256 hashes. Rotation and
revocation happen in a transaction with a row lock (`FOR UPDATE`), preventing
reuse of a rotated token.

---

## 4. Technology stack

### Frontend

| Concern | Choice |
|---|---|
| Framework | Expo SDK `~58.0.23`, React `19.3.0`, React Native `0.88.1` |
| Routing | `expo-router` `~58.0.30` with `typedRoutes` enabled |
| Web | `react-native-web`, static export (`web.output: "static"`) |
| Styling | NativeWind `4.2.6` + Tailwind CSS `3.4.17`, CSS variables |
| Animation | `react-native-reanimated`, `react-native-worklets`, `react-native-gesture-handler` |
| UI helpers | `@expo/vector-icons`, `expo-image`, `expo-linear-gradient`, `expo-glass-effect`, `expo-symbols`, `react-native-svg` |
| Device APIs | `expo-location`, `expo-secure-store`, `expo-linking`, `expo-web-browser`, `expo-device`, splash screen, status bar |
| Language | TypeScript `~6.0.3`, strict mode |
| Tooling | Babel (`babel-preset-expo`, NativeWind, worklets), Metro (SVG transformer), ESLint (`eslint-config-expo`), TypeScript path aliases `@/*` |

### Backend

| Concern | Choice |
|---|---|
| Language | Go 1.25 |
| Module | `github.com/gocerie/goshop/backend` |
| HTTP | `net/http` + `github.com/go-chi/chi/v5` |
| Database | PostgreSQL 16-alpine via `github.com/jackc/pgx/v5` (`pgxpool`) |
| Auth | `golang-jwt/jwt/v5`, `golang.org/x/crypto/bcrypt`, `crypto/sha256` |
| Migrations | Custom ordered SQL runner run at API startup |
| Containers | Docker multi-stage build (`golang:1.25-alpine` → `alpine:3.22`, non-root user), Docker Compose |

---

## 5. Repository structure

```text
Goshop/
├── src/
│   ├── app/
│   │   ├── _layout.tsx                 Root layout, providers, auth guard
│   │   ├── (onboarding)/               Onboarding slides, login, signup
│   │   ├── (tabs)/                     Home, browse, cart, orders, profile, settings
│   │   ├── product/[id].tsx            Product detail
│   │   ├── checkout.tsx                Checkout screen
│   │   ├── order-tracking/[id].tsx     Order status screen
│   │   ├── delivery.tsx                Map / delivery address
│   │   ├── language.tsx                Language picker
│   │   ├── notifications.tsx
│   │   └── payment-methods/            List, add card, add mobile money, detail
│   ├── components/                     Reusable UI components (+ .web.tsx variants)
│   ├── constants/theme.ts              Color/spacing/font tokens
│   ├── data/products.ts                Demo catalog (18 products, 7 categories)
│   ├── hooks/use-theme.ts
│   ├── services/api.ts                 Typed API client, ApiError
│   ├── store/                          auth, cart, language, payment-methods, theme
│   ├── global.css                      Theme CSS variables
│   └── svg.d.ts
├── assets/                             Logo, onboarding images, icon project
├── backend/
│   ├── cmd/api/main.go                 API entry point
│   ├── db/migrations/001_auth.sql      users + refresh_tokens
│   ├── internal/
│   │   ├── auth/                       auth.go, auth_test.go
│   │   ├── config/config.go
│   │   ├── database/                   database.go, migrations.go
│   │   └── httpapi/                    httpapi.go, httpapi_test.go
│   ├── .env.example
│   ├── compose.yaml
│   ├── Dockerfile
│   ├── go.mod / go.sum
├── scripts/reset-project.js            Expo template reset helper (destructive)
├── app.json                            Expo config
├── package.json / pnpm-lock.yaml
├── tsconfig.json                       strict TS, @/* aliases
├── tailwind.config.js / babel.config.js / metro.config.js / eslint.config.js
├── backendimpl.md                      Original backend design guide
├── AGENTS.md / CLAUDE.md               Expo docs directive for AI agents
└── README.md                           This file
```

Generated / ignored directories: `node_modules/`, `.expo/`, `dist/` (static web
export), `expo-env.d.ts`. Native `android/` and `ios/` folders are not checked
in (Expo managed workflow).

---

## 6. Prerequisites

- **Node.js** with **pnpm** (lockfile v9).
- **Go 1.25+** (to run the API locally without Docker).
- **Docker** with the Compose plugin (to run PostgreSQL + API in containers).
- **Expo CLI / Expo Go** or native simulators for mobile testing.
- Windows PowerShell is assumed for the example commands below.

---

## 7. Quick start

### 7.1 Start the backend

```powershell
cd backend
Copy-Item .env.example .env      # then edit JWT_SECRET (min 32 chars)
docker compose up --build -d     # starts postgres + api
docker compose ps
docker compose logs -f api
curl.exe http://localhost:8080/health/live
curl.exe http://localhost:8080/health/ready
```

Migrations run automatically when the API starts. Data persists in the
`goshop_postgres` named volume. `docker compose down` keeps the volume;
`docker compose down -v` deletes it permanently.

To run the API directly instead (PostgreSQL must already be reachable):

```powershell
cd backend
$env:DATABASE_URL = "postgres://goshop:goshop@localhost:5432/goshop?sslmode=disable"
$env:JWT_SECRET   = "replace-with-at-least-32-random-characters"
go run ./cmd/api
```

### 7.2 Start the frontend

From the repository root, set the API URL for your target platform, then start
Expo:

```powershell
$env:EXPO_PUBLIC_API_URL = "http://localhost:8080/api/v1"   # web / iOS simulator
pnpm install
pnpm start
```

Use `pnpm web`, `pnpm android` or `pnpm ios` for a specific platform. The value
of `EXPO_PUBLIC_API_URL` is embedded in the bundle on each rebuild — it must be
set in the environment that performs the build/export.

---

## 8. Configuration

### Backend (`backend/.env`, copy from `backend/.env.example`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `DATABASE_URL` | Yes | — | PostgreSQL connection string, e.g. `postgres://goshop:goshop@localhost:5432/goshop?sslmode=disable` |
| `JWT_SECRET` | Yes | — | Secret for signing JWTs; must be ≥ 32 characters |
| `HTTP_ADDR` | No | `:8080` | Address the HTTP server listens on |
| `ALLOWED_ORIGINS` | No | empty | Comma-separated CORS allowlist, e.g. `http://localhost:8081,http://localhost:19006`; `*` allows any origin |
| `MIGRATIONS_DIR` | No | `./db/migrations` | Directory of ordered `.sql` migrations (Compose sets `/migrations`) |

The Compose file currently hardcodes local DB credentials (`goshop` / `goshop`)
and a placeholder `JWT_SECRET` — change these before any non-local use.

### Frontend

| Variable | Required | Description |
|---|---|---|
| `EXPO_PUBLIC_API_URL` | Yes | Absolute `http:`/`https:` URL of the API, including the `/api/v1` prefix, e.g. `http://10.0.2.2:8080/api/v1` |

Useful values by platform:

| Where the app runs | Example URL |
|---|---|
| Web on the same machine / iOS simulator | `http://localhost:8080/api/v1` |
| Android emulator | `http://10.0.2.2:8080/api/v1` |
| Physical device on the same network | `http://<computer-LAN-IP>:8080/api/v1` |
| Production | `https://api.<domain>/api/v1` |

`localhost` inside a container refers to that container, not the host. Physical
devices must share the network with the computer and the firewall must allow
access. `EXPO_PUBLIC_*` values are public in the bundle — never put secrets in
them. No `.env` file is committed; `.env*.local` is gitignored.

External services used without API keys: Unsplash images (promotion carousel),
OpenStreetMap tiles and Nominatim geocoding (delivery screen).

---

## 9. Frontend

### Routes and screens

| Route | Purpose |
|---|---|
| `/(onboarding)` | 3-slide swipe onboarding |
| `/(onboarding)/login`, `/signup` | Authentication against the Go API |
| `/(tabs)` | Home: search, categories, promo carousel, stores, featured products |
| `/(tabs)/browse` | Category-filtered product grid |
| `/(tabs)/cart` | Cart contents and totals |
| `/(tabs)/orders` | Order history (currently static) |
| `/(tabs)/profile` | User profile, logout |
| `/(tabs)/settings` | Personal / Security / Appearance tabs, deep-linkable via `?tab=` |
| `/product/[id]` | Product detail |
| `/checkout` | Checkout (authenticated) |
| `/order-tracking/[id]` | Order tracking (authenticated) |
| `/delivery` | Map and delivery-address selection |
| `/language` | Language picker (8 languages) |
| `/notifications` | Notifications |
| `/payment-methods` | List, add card, add mobile money, detail |

The root layout's auth guard redirects unauthenticated users away from
`(tabs)/orders`, `(tabs)/profile`, `checkout`, `delivery`, `payment-methods` and
`order-tracking` to `/login`, and redirects authenticated users away from
onboarding to `/(tabs)`.

### State stores

- **auth** (`auth.tsx`): session, login, register, logout, token refresh,
  `authenticatedRequest`.
- **cart** (`cart.tsx`): in-memory cart seeded with demo items.
- **theme** (`theme.tsx`): system/light/dark; adds/removes the `dark` class on
  web and syncs with the system theme.
- **language** (`language.tsx`): selection among English, French, Spanish,
  German, Portuguese, Arabic, Swahili and Chinese (UI only).
- **payment-methods** (`payment-methods.tsx`): seeded cards and mobile-money
  accounts.

### Platform notes

- Tabs use native `NativeTabs` with SF Symbols on iOS/Android and
  `expo-router/ui` tabs with emoji on web (`.web.tsx` variants).
- Animations use Reanimated 4 with worklets; SVG imports are transformed into
  React components via Metro.
- Web is configured for static output; a prior export lives in `dist/`.
- `app.json` enables `typedRoutes` and `reactCompiler` experiments, deep links
  via the `goshop://` scheme, and a green splash screen.

---

## 10. Backend

### Server behavior

- Validates `DATABASE_URL` and `JWT_SECRET` at startup (fails fast).
- Creates a bounded `pgxpool` (max 20 connections) and pings the database.
- Applies all pending `.sql` migrations from `MIGRATIONS_DIR` in sorted order,
  tracked in a `schema_migrations` table and applied in transactions.
- Uses chi middleware: `RequestID`, `RealIP`, `Recoverer`, custom CORS.
- Enforces HTTP timeouts: 10s read, 5s read-header, 15s write, 60s idle.
- Gracefully shuts down on SIGINT/SIGTERM with a 10-second drain window.

### Auth implementation details

- Passwords: bcrypt at default cost, minimum 8 characters; emails lowercased
  and trimmed; unique constraint enforced in the database.
- Access token: HS256 JWT, `sub` = user UUID, 15-minute expiry, issuer
  `goshop-api`; verified with method + issuer checks.
- Refresh token: 32 random bytes (base64url); only its SHA-256 hash is stored.
  30-day expiry, rotated transactionally with row locking, revoked on logout.
- Error mapping: `invalid_credentials` (401), `email_taken` (409),
  `invalid_refresh_token` (401), `user_not_found` (404), otherwise
  `internal_error` (500).

---

## 11. API reference

Base URL: `<EXPO_PUBLIC_API_URL>` (locally `http://localhost:8080/api/v1`).
Health probes are served at the root of the host (not under `/api/v1`).

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `GET` | `/health/live` | No | Liveness probe → `{ "status": "ok" }` |
| `GET` | `/health/ready` | No | Readiness probe → `{ "status": "ready" }` |
| `POST` | `/api/v1/auth/register` | No | Create account, returns session |
| `POST` | `/api/v1/auth/login` | No | Start session, returns session |
| `POST` | `/api/v1/auth/refresh` | Refresh token in body | Rotate refresh token, returns new session |
| `POST` | `/api/v1/auth/logout` | Bearer access token | Revoke refresh token |
| `GET` | `/api/v1/me` | Bearer access token | Get signed-in user |

Successful JSON responses are wrapped as `{ "data": ... }`. `204` responses
have no body. Errors use:

```json
{ "error": { "code": "invalid_credentials", "message": "Email or password is incorrect." } }
```

### Register

```json
{ "name": "Ada", "email": "ada@example.com", "password": "secret123" }
```

### Login

```json
{ "email": "ada@example.com", "password": "secret123" }
```

### Refresh / Logout body

```json
{ "refresh_token": "<refresh-token>" }
```

### Session / user shape

```json
{
  "data": {
    "access_token": "<jwt>",
    "refresh_token": "<token>",
    "user": { "id": "<uuid>", "name": "Ada", "email": "ada@example.com" }
  }
}
```

### Example with curl

```powershell
curl.exe -X POST http://localhost:8080/api/v1/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"ada@example.com","password":"secret123"}'
```

The design guide (`backendimpl.md`) additionally specifies future endpoints for
categories, products, addresses and orders; these are **not implemented** in
the current API.

---

## 12. Data model

Current schema (`backend/db/migrations/001_auth.sql`):

| Table | Columns / constraints |
|---|---|
| `users` | `id uuid PK` (default `gen_random_uuid()`), `email text NOT NULL UNIQUE` (normalized), `name text NOT NULL`, `password_hash text NOT NULL`, `created_at timestamptz` |
| `refresh_tokens` | `id uuid PK`, `user_id uuid FK → users ON DELETE CASCADE`, `token_hash text UNIQUE`, `expires_at timestamptz`, `revoked_at timestamptz NULL`, `created_at timestamptz`; index on `user_id` |

Requires the `pgcrypto` extension for `gen_random_uuid()`.

The planned full model (in `backendimpl.md`) adds `categories`, `products`,
`inventory`, `addresses`, `orders`, `order_items` and `payments`. That guide
recommends storing money as integer minor units plus an ISO currency code. The
demo catalog uses mixed price scales (e.g. apples `75` vs milk `1.5`) and the
currency has not been confirmed — resolve this before importing catalog data
into a database.

---

## 13. Commands reference

### Frontend (repository root, pnpm)

| Command | Description |
|---|---|
| `pnpm install` | Install dependencies |
| `pnpm start` | Start Expo dev server |
| `pnpm web` | Start on web |
| `pnpm android` | Start on Android |
| `pnpm ios` | Start on iOS |
| `pnpm lint` | Run ESLint via `expo lint` |
| `pnpm reset-project` | Destructive: resets Expo template (`src/` + `scripts/`) |
| `npx expo export --platform web` | Produce a static web build in `dist/` (no npm script defined) |

### Backend (`backend/`, Go / Docker)

| Command | Description |
|---|---|
| `docker compose up --build -d` | Build and start PostgreSQL + API |
| `docker compose up -d postgres` | Start only the database |
| `docker compose logs -f api` | Follow API logs |
| `docker compose down` | Stop containers, keep the data volume |
| `docker compose down -v` | Stop containers and delete the database volume |
| `go run ./cmd/api` | Run API locally (needs DB + env vars) |
| `go build ./cmd/api` | Build API binary |
| `go test ./...` | Run Go tests |
| `go vet ./...` | Static analysis |
| `gofmt -w .` | Format Go code |

---

## 14. Testing

- Backend tests currently present: `internal/auth/auth_test.go` (password and
  refresh-token hashing) and `internal/httpapi/httpapi_test.go` (CORS origin
  allowlist). Run with `go test ./...`.
- No frontend test framework, typecheck script or CI pipeline is configured.
  Available frontend checks are `pnpm lint` and TypeScript strict mode.
- Suggested coverage as the system grows (from the design guide): pricing and
  order-state unit tests, PostgreSQL integration tests, HTTP auth/ownership
  tests, API-service and loading/error-state client tests, an end-to-end
  register → browse → checkout → order-detail flow, and checks for stock races,
  idempotency, migration repeatability and health probes.

---

## 15. Deployment

- Web is configured for **static export** (`app.json` → `web.output: "static"`);
  serve the generated `dist/` from any static host/CDN.
- The API container is a multi-stage, non-root image exposing port 8080 and
  expects `DATABASE_URL`, `JWT_SECRET`, `HTTP_ADDR`, `ALLOWED_ORIGINS` and
  `MIGRATIONS_DIR` from the environment.
- Before production: replace hardcoded Compose credentials and placeholder JWT
  secret, inject secrets from a secret manager, require HTTPS, run migrations as
  a controlled release step, use private/managed PostgreSQL with backups, add
  structured logging/metrics/alerts, and keep aggregate connection-pool limits
  within the database budget.
- No `eas.json`, CI workflow or production deployment configuration exists yet.

---

## 16. Security

- No database credentials or JWT secrets are shipped in the app; only the
  public API URL is embedded.
- Passwords are bcrypt-hashed; only SHA-256 hashes of refresh tokens are stored.
- Access tokens are short-lived (15 minutes) and held in memory; refresh tokens
  rotate on use and are revoked on logout.
- CORS uses an explicit `ALLOWED_ORIGINS` allowlist (or `*`); it is a browser
  policy, not authentication.
- Requests are limited to 1 MB and unknown JSON fields are rejected.
- Private endpoints verify the bearer token and scope operations to the
  authenticated user.
- For payments (when implemented), use tokenized provider flows — never store
  raw card numbers or CVV — verify signed webhooks and make payment transitions
  idempotent.

---

## 17. Known limitations and caveats

- The installed Expo SDK is 58.x, while `AGENTS.md` / `CLAUDE.md` instruct AI
  agents to read the v57 docs. Verify the correct docs version when editing.
- `backendimpl.md` is an outdated implementation plan; `cmd/migrate` and the
  migrations tool it mentions do not exist. Migrations run at API startup.
- Catalog, cart, orders, addresses and payments are still demo/prototype data
  on the client; no corresponding API endpoints exist.
- `src/app/settings/` is an empty leftover directory.
- `eslint-config-expo` is used by `eslint.config.js` but is not declared
  directly in `devDependencies`.
- Demo product prices use mixed scales/currencies; confirm the real currency,
  prices and units before importing to a database.
- The language picker does not translate strings; notifications and settings
  flows are UI-only.
- `expo-env.d.ts` is gitignored yet present; `.expo/` and `dist/` are generated
  artifacts.

---

## 18. Roadmap

| Phase | Deliverable |
|---|---|
| 0. Decisions | Confirm currency, prices/units, delivery pricing, auth policy, first payment method and deployment target |
| 1. Catalog API | `GET /categories`, `GET /products`, `GET /products/{id}`; replace `src/data/products.ts` at runtime |
| 2. Cart & checkout | Server-side pricing, inventory transaction, idempotent order creation using integer minor units |
| 3. Orders | Replace static orders/tracking with `GET /orders`, `GET /orders/{id}` and real statuses |
| 4. Addresses | CRUD for user-owned delivery addresses; wire the delivery screen |
| 5. Payments | Provider sandbox, tokenized flow, verified webhooks, payment status |
| 6. Release | CI, frontend tests/typecheck, staging, secrets, backups, alerts, runbook |

See `backendimpl.md` for the original detailed design, API contract and
acceptance checklist.

---

## 19. License

See [LICENSE](LICENSE).
