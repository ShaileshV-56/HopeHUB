# HopeHUB Backend (Express + PostgreSQL)

## Getting Started

1. Copy env file

```bash
cp .env.example .env
# edit .env to set DATABASE_URL and optionally PORT
```

2. Install dependencies

```bash
npm install
```

3. Run migrations

```bash
npm run migrate
```

4. Start in dev mode

```bash
npm run dev
```

## API Endpoints

- POST `/api/donors/register`
- POST `/api/organizations/register`
- POST `/api/donations/food`
- POST `/api/donation-requests`
- GET `/health`

All POST endpoints expect JSON bodies; validation errors return 400.
