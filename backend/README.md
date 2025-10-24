# HopeHUB Backend (Express + PostgreSQL)

An Express + PostgreSQL backend implementing the endpoints used by the HopeHUB frontend.

## Prerequisites
- Node.js 18+
- PostgreSQL 13+

## Setup
1. Copy env file and edit values:
```bash
cp .env.example .env
```

2. Install dependencies:
```bash
npm install
```

3. Run migrations:
```bash
npm run migrate:up
```

4. Start the dev server:
```bash
npm run dev
```

## API Base
- Base URL: `http://localhost:5000/api`

## Endpoints
- Auth: `POST /auth/signup`, `POST /auth/signin`, `POST /auth/signout`, `GET /auth/me`
- Donors: `POST /donors/register`, `GET /donors`, `GET /donors/:id`, `PUT /donors/:id`
- Food Donations: `POST /donations/food`, `GET /donations/food`, `GET /donations/food/:id`, `PUT /donations/food/:id`, `PATCH /donations/food/:id/status`, `DELETE /donations/food/:id` (owner only)
- Organizations: `POST /organizations/register`, `GET /organizations`, `GET /organizations/:id`, `PUT /organizations/:id`, `DELETE /organizations/:id` (owner only)
- Donation Requests: `POST /donation-requests`, `GET /donation-requests`, `GET /donation-requests/:id`, `PATCH /donation-requests/:id/status`

All endpoints return `{ success, data?, message? }` as expected by the frontend.

### Ownership
- Migrations add `user_id` to `food_donations` and `helper_organizations`.
- Create endpoints require auth and set `user_id` from JWT.
- Delete endpoints require auth and delete only when `user_id` matches the caller.
