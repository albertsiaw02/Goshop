# Goshop: Go, PostgreSQL, and Docker Backend Guide

This guide describes how to build a Go REST API for the existing Expo / React
Native grocery app, use PostgreSQL for persistent data, run the services locally
with Docker Compose, and connect the app to the API.

> **Current state:** The app is currently a frontend prototype. Products and
> orders are hard-coded, the cart is held in React state, login and signup only
> navigate between screens, checkout uses fixed totals, and order IDs are
> generated locally. Treat the backend as the source of truth as these flows are
> implemented.

## Contents

- [1. Architecture](#1-architecture)
- [2. Recommended project structure](#2-recommended-project-structure)
- [3. Technology choices](#3-technology-choices)
- [4. Data model](#4-data-model)
- [5. Set up Docker and PostgreSQL](#5-set-up-docker-and-postgresql)
- [6. Build the Go API](#6-build-the-go-api)
- [7. API contract](#7-api-contract)
- [8. Connect the Expo app](#8-connect-the-expo-app)
- [9. Security and payments](#9-security-and-payments)
- [10. Testing and deployment](#10-testing-and-deployment)
- [11. Implementation sequence](#11-implementation-sequence)
- [12. Acceptance checklist](#12-acceptance-checklist)

## 1. Architecture

```text
Expo app (Android / iOS / web)
        | HTTPS + JSON; bearer access token
        v
Go API (stateless HTTP service) ---- payment provider (later, tokenized)
        |
        | pgx connection pool; parameterized SQL
        v
PostgreSQL (private network; persistent volume)
```

The mobile app communicates only with the API. The Go service validates
requests, enforces business rules, and is the only service that connects to
PostgreSQL. Never put database credentials, payment secrets, or privileged API
keys in the Expo app.

Start with a **modular monolith**: one API service organized by business
capability. Avoid microservices and a generic repository framework until there
is a concrete need.

### First-release scope

- Public product catalog, categories, search, and pagination.
- Customer registration, login, profile, and session management.
- Delivery addresses and cart/checkout validation.
- Order creation, order history, order detail, and basic status tracking.
- Database migrations, automated tests, structured logs, and health checks.

Defer social login, promotions, real-time driver GPS, refunds, and multi-warehouse
inventory until the core workflow is stable.

## 2. Recommended project structure

Keep the existing Expo application and add a `backend` folder:

```text
Goshop/
├── src/                           # Existing Expo application
│   ├── app/
│   ├── components/
│   ├── data/
│   └── services/api.ts            # Add typed API client
├── backend/
│   ├── cmd/
│   │   ├── api/main.go             # HTTP API entry point
│   │   └── migrate/main.go         # Explicit migration command
│   ├── internal/
│   │   ├── config/                 # Environment parsing and validation
│   │   ├── httpapi/                # Routes, middleware, handlers, DTOs
│   │   ├── auth/                   # Password/session/token operations
│   │   ├── catalog/                # Product and category use cases
│   │   ├── cart/                   # Checkout validation and quote
│   │   ├── orders/                 # Transactional order workflows
│   │   └── database/               # Pool setup and transaction helpers
│   ├── db/migrations/              # Ordered SQL migrations
│   ├── sql/                        # Query source, if using sqlc
│   ├── Dockerfile
│   ├── compose.yaml
│   ├── .env.example
│   └── go.mod
└── README.md
```

Handlers should handle HTTP concerns (decode, validate, status codes, response
mapping). Put business rules in service/use-case functions and SQL in query
functions or generated `sqlc` code.

## 3. Technology choices

| Concern | Starting choice | Why |
|---|---|---|
| HTTP server | Go `net/http` with `chi` | Small router and standard request/response types |
| PostgreSQL driver | `pgx/v5` and `pgxpool` | Native PostgreSQL support and connection pooling |
| SQL | Explicit parameterized SQL; optionally `sqlc` | Clear queries and typed bindings without ORM magic |
| Migrations | `goose` or `golang-migrate` | Ordered, reviewable, repeatable schema changes |
| API | REST JSON at `/api/v1` | Straightforward to consume from Expo |
| Configuration | Validated environment variables | Works in Compose and deployment platforms |

Use `context.Context` for requests and database operations, timeouts for
requests and queries, and a bounded database connection pool. Paginate list
endpoints and set a maximum page size. Use UTC timestamps and RFC 3339 over the
API.

## 4. Data model

Start with these tables. Refine fields as the product requirements are confirmed.

| Table | Example fields and constraints |
|---|---|
| `users` | `id`, normalized unique `email`, `password_hash`, `name`, `created_at` |
| `categories` | `id`, unique `slug`, `name`, `active` |
| `products` | `id`, unique `sku`, `category_id`, `name`, `description`, `price_minor`, `currency`, `unit`, `image_url`, `active` |
| `inventory` | `product_id`, `quantity_available`, `updated_at`; quantity must not be negative |
| `addresses` | `id`, `user_id`, recipient and address fields; belongs to one user |
| `orders` | `id`, public number, `user_id`, address snapshot, status, totals, currency, idempotency key, timestamp |
| `order_items` | `order_id`, `product_id`, name/SKU snapshots, quantity, unit-price and line-total snapshots |
| `payments` | order, provider, provider reference, status, amount, currency; no raw card data |
| `refresh_tokens` | user, token hash, expiry and revocation timestamps |

### Currency and money

The demo catalog has mixed-looking prices, and some screens display a dollar
sign. **Confirm the actual currency and product prices/units before importing
the catalog.** Store money as an integer number of minor units plus an ISO
currency code (for example, 250 USD cents), never as a floating-point number.
Format amounts for display in the app.

### Example catalog migration

```sql
CREATE TABLE categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug text NOT NULL UNIQUE,
    name text NOT NULL,
    active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    sku text NOT NULL UNIQUE,
    category_id uuid REFERENCES categories(id),
    name text NOT NULL,
    description text NOT NULL DEFAULT '',
    price_minor bigint NOT NULL CHECK (price_minor >= 0),
    currency char(3) NOT NULL,
    unit text NOT NULL,
    image_url text,
    active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX products_active_category_idx
    ON products (category_id, name) WHERE active = true;
```

Use a migration tool to manage files and verify that the chosen PostgreSQL
version supports the UUID-generation function. Once a migration has been applied
in a shared environment, make further changes with a new migration rather than
editing history.

### Order creation must be transactional

1. Authenticate the customer and confirm the delivery address belongs to them.
2. Validate the request and its idempotency key.
3. Load current products and inventory from PostgreSQL. Ignore client-supplied
   prices and totals.
4. Lock inventory rows or use conditional stock updates to prevent overselling.
5. Calculate item totals, delivery fees, taxes (if applicable), and the final
   total using integer minor units.
6. Insert the order and item snapshots and reserve/decrement stock in the same
   database transaction.
7. Commit only when all required operations succeed.

If payment is external, create an explicit pending-payment state and make
payment confirmation a separate, verified state transition.

## 5. Set up Docker and PostgreSQL

Create `backend/.env.example`:

```dotenv
POSTGRES_DB=goshop
POSTGRES_USER=goshop
POSTGRES_PASSWORD=local_only_change_me
DATABASE_URL=postgres://goshop:local_only_change_me@db:5432/goshop?sslmode=disable
HTTP_ADDR=:8080
APP_ENV=development
LOG_LEVEL=debug
ACCESS_TOKEN_TTL=15m
```

Create `backend/compose.yaml`:

```yaml
services:
  db:
    image: postgres:17-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB:?copy .env.example to .env}
      POSTGRES_USER: ${POSTGRES_USER:?set POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?set POSTGRES_PASSWORD}
    ports:
      - "127.0.0.1:5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER} -d $${POSTGRES_DB}"]
      interval: 5s
      timeout: 3s
      retries: 10

  api:
    build:
      context: .
      dockerfile: Dockerfile
    restart: unless-stopped
    environment:
      DATABASE_URL: ${DATABASE_URL:?set DATABASE_URL}
      HTTP_ADDR: :8080
      APP_ENV: development
      LOG_LEVEL: debug
    ports:
      - "127.0.0.1:8080:8080"
    depends_on:
      db:
        condition: service_healthy

volumes:
  postgres_data:
```

The PostgreSQL image tag above is an example. Choose a supported version, and
pin an image digest for production. The sample password is for local development
only. Commit `.env.example`, but add `.env` to `.gitignore`.

### Run the database (Windows PowerShell)

```powershell
cd backend
Copy-Item .env.example .env
# Edit .env and use a local-only password. Never commit .env.
docker compose up -d db
docker compose ps
```

After you have implemented the migration command and API image:

```powershell
docker compose run --rm --entrypoint /app/migrate api up
docker compose up --build -d api
docker compose logs -f api
curl.exe http://localhost:8080/health/live
curl.exe http://localhost:8080/health/ready
```

`docker compose down` stops containers but preserves the named data volume.
`docker compose down -v` **permanently deletes** the local database volume; use
it only when that data can be discarded.

For production, run migrations as an explicit one-shot release job before
traffic is sent to the new API. Do not have every API replica run migrations at
startup.

## 6. Build the Go API

From `backend/`, initialize the module and add the initial dependencies:

```powershell
go mod init example.com/goshop/backend
go get github.com/go-chi/chi/v5
go get github.com/jackc/pgx/v5
go get github.com/pressly/goose/v3
go mod tidy
```

Replace the example module path if the backend will be published or imported
elsewhere. Pin the Go version and tool versions used by the team.

### Startup responsibilities

1. Parse and validate required environment variables; fail fast if configuration
   is missing or invalid.
2. Create a `pgxpool` with connection limits and lifetime settings, then ping the
   database with a startup timeout.
3. Register routes and middleware, including request IDs, recovery, and access
   logging that avoids sensitive data.
4. Add `/health/live` and `/health/ready` probes.
5. Configure HTTP read, write, idle, and header timeouts.
6. On SIGINT/SIGTERM, drain in-flight requests and close the database pool.

### Example routes

```go
r := chi.NewRouter()
r.Use(middleware.RequestID)
r.Use(middleware.RealIP)
r.Use(middleware.Recoverer)

r.Get("/health/live", liveHandler)
r.Get("/health/ready", readyHandler)

r.Route("/api/v1", func(r chi.Router) {
    r.Get("/categories", listCategoriesHandler)
    r.Get("/products", listProductsHandler)
    r.Get("/products/{id}", getProductHandler)
    r.Post("/auth/register", registerHandler)
    r.Post("/auth/login", loginHandler)

    r.Group(func(r chi.Router) {
        r.Use(requireAccessToken)
        r.Get("/me", getMeHandler)
        r.Get("/orders", listOrdersHandler)
        r.Post("/orders", createOrderHandler)
        r.Get("/orders/{id}", getOrderHandler)
    })
})
```

Pass request contexts to every database call. Use SQL parameters (`$1`, `$2`)
instead of concatenating user input. Close query rows and check `rows.Err()`.
Rollback failed transactions and commit exactly once. Log internal database
errors with a request ID, but return a safe error to the client.

## 7. API contract

| Method and path | Authentication | Purpose |
|---|---|---|
| `GET /api/v1/categories` | No | List active categories |
| `GET /api/v1/products?category=&q=&cursor=&limit=` | No | Search, filter, and paginate products |
| `GET /api/v1/products/{id}` | No | Product details |
| `POST /api/v1/auth/register` | No | Create an account |
| `POST /api/v1/auth/login` | No | Start a session |
| `POST /api/v1/auth/refresh` | Refresh credential | Rotate refresh token and issue an access token |
| `POST /api/v1/auth/logout` | Yes | Revoke the current refresh session |
| `GET /api/v1/me` | Yes | Get the signed-in customer |
| `GET/POST /api/v1/addresses` | Yes | List or add owned addresses |
| `GET/POST /api/v1/orders` | Yes | List orders or create an order |
| `GET /api/v1/orders/{id}` | Yes | Fetch an order owned by the caller |
| `GET /health/live`, `/health/ready` | No/internal | Liveness and readiness probes |

### Create an order

The client sends product IDs and quantities, **not prices**:

```http
POST /api/v1/orders
Authorization: Bearer <access-token>
Idempotency-Key: 3e3a8b30-5f74-4dcb-b627-2d790d3e745a
Content-Type: application/json
```

```json
{
  "address_id": "d56b44fe-014d-45a1-b14a-68cce69a58e0",
  "items": [
    { "product_id": "beea5fe1-6930-4c64-b239-e683eb365101", "quantity": 2 },
    { "product_id": "64965bd9-ddb0-47ed-a8a0-7050f1a17375", "quantity": 1 }
  ]
}
```

The server loads current prices, availability, fees, and currency. Store a
user-scoped idempotency key so a retry after a timeout cannot create a duplicate
order.

### Response conventions

Use stable JSON fields, explicit currency, and UTC timestamps:

```json
{
  "data": {
    "id": "order_uuid",
    "number": "ORD-2026-001042",
    "status": "pending_payment",
    "currency": "USD",
    "subtotal_minor": 2450,
    "delivery_minor": 250,
    "total_minor": 2700,
    "created_at": "2026-11-15T04:00:00Z"
  }
}
```

Use a consistent error format:

```json
{
  "error": {
    "code": "out_of_stock",
    "message": "One or more items are no longer available.",
    "request_id": "req_..."
  }
}
```

Suggested status codes: `200`/`201` success, `400` malformed request,
`401` unauthenticated, `403` forbidden, `404` not found/not visible,
`409` conflict such as insufficient stock, `429` rate limited, `500` unexpected
server error, and `503` temporarily unavailable. Choose a consistent validation
status convention and apply it throughout. Scope all customer-owned queries to
the authenticated user.

## 8. Connect the Expo app

### Development API URL

| Where the app runs | Example URL |
|---|---|
| Web on the same computer | `http://localhost:8080` |
| iOS simulator | `http://localhost:8080` |
| Android emulator | `http://10.0.2.2:8080` |
| Physical phone | `http://<computer-LAN-IP>:8080` |
| Production | `https://api.your-domain.example` |

`localhost` inside a container refers to that container, not the host. A phone
must share the network with the computer, and the development firewall must
allow access. Production must use HTTPS. Never expose the database port publicly.

Configure Expo's public API URL in a development environment file:

```dotenv
EXPO_PUBLIC_API_URL=http://10.0.2.2:8080/api/v1
```

`EXPO_PUBLIC_*` values are included in the app bundle, so they are not secrets.

Add a shared typed API helper at `src/services/api.ts`. It should:

- Require the API URL instead of silently falling back to mock data.
- Set JSON headers and attach the access token when needed.
- Parse the stable API error response and expose useful, safe errors to screens.
- Support cancellation/timeouts and coordinate token refresh.

### Integrate screens in this order

1. Replace runtime use of the hard-coded `PRODUCTS` in `src/data/products.ts`
   with `GET /products` and `GET /products/{id}`.
2. Remove seeded cart data from `src/store/cart.tsx`. Keep a guest cart locally
   if desired, but send product IDs and quantities for checkout.
3. Wire `src/app/(onboarding)/login.tsx` and `signup.tsx` to the auth endpoints.
   Store refresh credentials using platform secure storage (for example,
   Expo SecureStore where supported), not ordinary AsyncStorage.
4. Update `src/app/checkout.tsx` to submit the address ID and cart lines and
   display the totals returned by the server.
5. Replace the random order ID created in checkout with the returned server order
   ID.
6. Replace static data in `src/app/(tabs)/orders.tsx` with `GET /orders`.
7. Update `src/app/order-tracking/[id].tsx` to fetch `GET /orders/{id}`.
8. Add loading, empty, offline, unauthorized, and retry states. Do not silently
   show demo data when a request fails.

Keep UI components independent of transport details. The app should display
server-calculated prices and real order status.

## 9. Security and payments

- Require HTTPS in production.
- Hash passwords with a reviewed, maintained algorithm such as Argon2id or
  bcrypt using appropriate parameters. Never store plaintext passwords.
- Use short-lived access tokens and rotating refresh tokens. Store only a hash
  of refresh tokens server-side; revoke them on logout and password change.
- Rate limit login, registration, and refresh endpoints.
- Validate request size and fields; enforce authentication and per-user
  authorization on every private operation.
- Use least-privilege database roles, private networking, parameterized SQL, and
  secrets management. Never commit `.env` or log credentials and tokens.
- Do not reveal whether another customer's account or order exists.
- Treat CORS as a browser policy, not as authentication.
- Collect only the personal data needed and define retention/deletion rules.

### Payments

Do not collect or store full card numbers or CVV in the app's API or database.
Use a payment provider's tokenized SDK or hosted flow and persist only provider
references and payment status. Verify signed webhooks, reject replayed event
IDs, and make payment transitions idempotent. Do not mark an order paid based
only on a client callback.

Confirm the required payment methods and provider before implementing payment
collection.

## 10. Testing and deployment

### Tests to add

- Unit tests for pricing, validation, token expiry, and order state transitions.
- PostgreSQL integration tests for SQL, constraints, transactions, and migrations.
- HTTP tests for response shapes, status codes, authentication, and ownership.
- Mobile tests for API services and loading/error/success states.
- End-to-end test: register → browse → checkout → order detail.
- Operational checks for health probes, shutdown, connection failures, and
  database restore procedures.

At minimum, test that:

- A customer cannot view another customer's address or order.
- Order totals are calculated from server-side prices, not submitted values.
- A repeated idempotency key does not create a duplicate order.
- Concurrent checkouts cannot sell more stock than is available.
- Failed checkout writes roll back completely.
- Inactive products and invalid quantities cannot be ordered.
- Passwords and tokens never appear in responses or logs.
- Migrations work on a clean database and from the previous release schema.

### Local Go checks

From `backend/`:

```powershell
go test ./...
go vet ./...
go build ./cmd/api ./cmd/migrate
```

Run `gofmt` on Go files before committing. CI should run tests, static checks,
and container builds against a disposable test database. Never use production
data in tests.

### Production baseline

- Run stateless API containers behind HTTPS ingress.
- Prefer managed PostgreSQL for an initial deployment; keep it private and
  enable encryption, backups, and monitoring.
- Inject secrets from the platform secret manager; use separate credentials
  per environment.
- Run migrations as a reviewed release job and use backward-compatible
  expand/contract schema changes.
- Add structured logs with request IDs, safe metrics, readiness probes, alerts,
  and graceful shutdown.
- Configure automated backups and point-in-time recovery; schedule restore
  drills and define recovery objectives.
- Keep aggregate connection-pool limits within the database connection budget.

Docker Compose is for local development and smoke tests, not by itself a complete
production platform.

## 11. Implementation sequence

| Phase | Deliverable | Completion check |
|---|---|---|
| 0. Decisions | Confirm currency, prices/units, delivery pricing, auth policy, first payment method, and deployment target | Decisions recorded; demo catalog reconciled |
| 1. Skeleton | Go module, configuration, router, health endpoints | Go build/tests pass; liveness returns 200 |
| 2. Database | Compose PostgreSQL, connection pool, migrations, catalog seed data | Clean database migrates; data persists on restart |
| 3. Catalog | Category/product queries and read endpoints | API response verified and rendered in browse screen |
| 4. Accounts | Registration, login, profile, refresh, logout, ownership checks | Auth and access-control tests pass |
| 5. Checkout | Server pricing, inventory transaction, idempotent order creation | Retry and concurrent-stock tests pass |
| 6. Orders | Order history/detail/status and mobile error states | Static order data removed |
| 7. Payments | Provider sandbox, token/reference flow, verified webhooks | Success, failure, and replay tests pass |
| 8. Release | CI, staging, secrets, backups, alerts, runbook | Smoke test and restore/rollback review complete |

**Recommended first milestone:** Confirm the real currency and prices, start
PostgreSQL with Compose, create the catalog migration and seed data, implement
`GET /api/v1/products`, verify it with `curl.exe`, and render its response on
the browse screen. This small end-to-end slice validates networking and
configuration before the larger authentication and checkout work.

## 12. Acceptance checklist

- [ ] A clean checkout can start PostgreSQL and the API using documented steps.
- [ ] PostgreSQL reports healthy and data survives container restart.
- [ ] Migrations are repeatable and do not rely on every API replica running them.
- [ ] Catalog, account, address, and order data have appropriate constraints and
  ownership rules.
- [ ] Checkout is server-priced, transactional, concurrency-safe, and idempotent.
- [ ] The API contract defines auth, pagination, errors, and status codes.
- [ ] The Expo app uses a configurable API URL and contains no backend secrets.
- [ ] Tests cover authorization, stock races, retries, migrations, and key flows.
- [ ] CI runs checks and builds the API/container.
- [ ] Logs, health probes, secrets, and database backups are configured for the
  deployment environment.
- [ ] No raw payment card number or CVV is stored by the application.

## Existing Expo app resources

The frontend is an Expo Router project. Install dependencies and start it with:

```powershell
pnpm install
pnpm start
```

Use the Expo CLI prompts to open a development build, emulator, or web client.
The backend steps in this README are a plan; the backend files and API described
above still need to be implemented.
