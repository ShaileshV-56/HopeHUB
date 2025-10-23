# API Configuration Guide

This directory contains configuration files for external API integrations in HopeHUB.

## Files

- `apiConfig.ts` - Main configuration for external/public API endpoints

## Security Best Practices

### Public vs Secret Keys

- Safe in `apiConfig.ts` (Client-side):
  - Stripe Publishable Key
  - Google Maps API Key (restricted)
  - Mapbox Public Token
  - Google Analytics Measurement ID
- Never store in `apiConfig.ts`:
  - Stripe Secret Key
  - Twilio Auth Token
  - OpenAI API Key
  - Resend API Key
  - Database credentials

### Using Secret Keys

Use your Node.js/Express backend for anything that requires secrets. Put secrets in backend environment variables (e.g. `backend/.env`) and expose safe endpoints from the backend (e.g. `/api/integrations/*`). The frontend should call those backend endpoints instead of calling third-party services directly.

## Adding New Integrations

1. Add any public config to `apiConfig.ts` (publishable keys only)
2. Implement a secure backend route under `/api/integrations/...`
3. Call the backend route from the frontend with `fetch` or the API client

## Examples

### Email Integration (Resend via backend)

```ts
await fetch('/api/integrations/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ to: 'user@example.com', subject: 'Welcome', html: '<h1>Hello</h1>' }),
});
```

### Weather (public API)

```ts
import { API_ENDPOINTS } from '@/config/apiConfig';

const apiKey = API_ENDPOINTS.weather.openWeatherMap.publicKey;
const city = 'London';
const response = await fetch(
  `${API_ENDPOINTS.weather.openWeatherMap.endpoint}/weather?q=${city}&appid=${apiKey}&units=metric`
);
const data = await response.json();
```

## Notes

- Always prefer backend routes for anything needing secrets
- Rate limit and add auth on backend where needed
- Keep documentation updated when adding integrations
