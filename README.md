# HopeHUB — Food Donation & Relief Coordination

HopeHUB connects surplus food and relief resources to organizations and communities in need. It features a modern React frontend and a TypeScript/Express backend powered by PostgreSQL. Legacy blood-donor and Supabase integrations have been fully removed.

## Features
- **Food donations**: Organizations post available food/resources, track status to completion
- **Organization registry**: Register helper organizations with capacity/specialization
- **Requests & pledges**: Request food/resources and manage pledges (first-come or approval)
- **Authentication**: JWT-based auth (no Supabase)
- **Analytics**: Lightweight stats endpoints for dashboards

## Project Structure
```
HopeHUB/
├─ frontend/           # React + Vite + TypeScript + Tailwind + shadcn/ui
├─ backend/            # Express API + PostgreSQL (pg)
├─ database/           # SQL migrations executed by a simple runner
├─ api/                # Client helpers
└─ docker-compose.yml  # Local Postgres + backend
```

## Quick Start

### Prerequisites
- Node.js 18+
- Docker (for local Postgres), or PostgreSQL installed locally

### Run with Docker (recommended)
```bash
# From repo root
docker-compose up -d

# Backend will run migrations automatically and start on http://localhost:5000
```

### Run services manually
Backend
```bash
cd backend
npm install

# Copy and edit environment
cp .env.example .env
# Required: DATABASE_URL=postgres://<user>:<pass>@<host>:5432/hopehub
# Optional: CORS_ORIGIN, JWT_SECRET, JWT_EXPIRES_IN, BREVO_API_KEY

# Run migrations, then start
npm run migrate:up
npm run dev
```

Frontend
```bash
cd frontend
npm install
npm run dev
# Vite dev server will start (default http://localhost:5173)
```

## Configuration
Backend environment variables (see `backend/src/config/env.ts`):
- `DATABASE_URL` (required): Postgres connection string
- `PORT` (default 5000)
- `CORS_ORIGIN` (default `*`)
- `JWT_SECRET` (default dev value — change in production)
- `JWT_EXPIRES_IN` (default `7d`)
- `BREVO_API_KEY` (optional; enables email service)

## Migrations
The backend includes a simple migration runner (`backend/src/utils/migrate.ts`) that applies SQL files in `database/migrations` in lexicographic order and records them in a `_migrations` table.

Important notes:
- Legacy blood-donor tables have been removed from the initial migration. A historical cleanup migration remains to safely drop any remnants on existing databases.
- To apply migrations: `npm run migrate:up` (or via `docker-compose` startup).

## API Overview
Base URL: `http://localhost:5000/api`

- `GET /health` — Health check
- `POST /auth/login`, `POST /auth/register` — Auth
- `GET/POST /organizations` — Register/list organizations
- `GET/POST /donations/food` — Create/list food donations
- `GET/POST /donation-requests` — Request/approve/complete donations
- `GET/POST /food-requests` — Community food requests and pledges
- `GET /stats` — Aggregated metrics

