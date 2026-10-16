# ClientPulse
A simple, hyper-polished SaaS tool where Dutch freelancers or digital agencies can manage clients, log project hours, and auto-generate invoices with localized payment links.

## Stack
Laravel → Next.js w/Typescript and TailwindCSS

## Quick start

```bash
git clone <this repo> && cd ClientPulse
cp .env.example .env
docker compose up -d --build
```

First boot installs dependencies and runs migrations, so it takes a few minutes.
Watch it with `docker compose logs -f backend`.

| Service    | URL                            | What it is                                  |
| ---------- | ------------------------------ | ------------------------------------------- |
| Laravel    | http://localhost:8000          | `php artisan dev` — web, queue, logs, Vite |
| Next.js    | http://localhost:3000          | `next dev`                                  |
| Vite HMR   | http://localhost:5173          | Asset server, injected by `@vite`           |
| Mailpit    | http://localhost:8025          | Every mail the app sends, caught            |

Postgres (`localhost:5432`) and Redis are published so you can point a GUI at them;
`mailpit` receives SMTP on `1025`.

Run one-off commands inside the containers:

```bash
docker compose exec backend php artisan migrate
docker compose exec backend php artisan db:seed
docker compose exec backend php artisan test --compact
docker compose exec backend vendor/bin/pint --test
docker compose exec frontend npm run lint
docker compose exec frontend npx tsc --noEmit
```

Use `vendor/bin/pint --test` rather than `--dirty` inside the container: only
`backend/` is mounted, so there is no Git metadata for `--dirty` to diff against.
Run `--dirty` on the host, where your own `vendor/` lives.

Composer and npm dependencies live in Docker volumes rather than on your machine,
so the `vendor/` and `node_modules/` directories on the host are *not* what the
containers use. Edit `composer.json` or a `package.json` and the next
`docker compose up -d` reinstalls automatically — the entrypoints checksum the
lockfiles and re-run `composer install` / `npm ci` only when they changed.

To start over, including the database:

```bash
docker compose down -v
```

### Running without Docker

`backend/` and `frontend/` also work standalone: `cd backend && composer setup && php artisan dev`,
then `cd frontend && npm install && npm run dev`. That path defaults to SQLite, the
`log` mail driver, and `database` cache/session/queue drivers, whereas the Compose
stack runs Postgres, Mailpit, and Redis.

## Features
- Dashboards w/graphs and charts
- Interactive Time Tracker
- Localisation (Dutch and English)

## Technical Features
- Multi-tennancy
- Mollie Sandbox API for mock invoice payments
- Authentication
- An endpoint that agrregates time logs and generates a PDF invoice
- Background job that sends emails to a client when overdue
- A webhook receiver that listens to Mollie to mark an invoice as “Paid” the moment a mock iDEAL transaction completes
- PHP 8.3+ with strict typing and zero “any” types in the Typescript code
- Pest + Vitest testing across the stack (Pest today, Vitest planned)
- docker-compose.yml file

## Routes
/login/
/logout/
/dashboard/
/invoices/
/clients/
/projects/

## Models
- User
- Invoice
- Client
- Project