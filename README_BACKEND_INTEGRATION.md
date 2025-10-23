# Backend Integration Guide

This project has been updated to use a Node.js/Express backend instead of Supabase.

## Configuration

### 1. Update Backend URL

Edit `src/services/api.ts` and update the `BASE_URL` constant:

```typescript
const BASE_URL = 'http://localhost:5000/api'; // Change to your backend URL
```

Or update `src/config/backend.ts`:

```typescript
export const BACKEND_URL = 'http://localhost:5000'; // Your backend URL
```

### 2. Backend Requirements

Your Node.js/Express backend should have the following API endpoints:

#### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/me` - Get current user

#### Blood Donors
- `POST /api/donors/register` - Register a blood donor
- `GET /api/donors` - Get all blood donors
- `GET /api/donors/:id` - Get donor by ID
- `PUT /api/donors/:id` - Update donor information

#### Food Donations
- `POST /api/donations/food` - Submit a food donation
- `GET /api/donations/food` - Get all food donations
- `GET /api/donations/food/:id` - Get donation by ID
- `PUT /api/donations/food/:id` - Update donation
- `PATCH /api/donations/food/:id/status` - Update donation status

#### Helper Organizations
- `POST /api/organizations/register` - Register an organization
- `GET /api/organizations` - Get all organizations
- `GET /api/organizations/:id` - Get organization by ID
- `PUT /api/organizations/:id` - Update organization

#### Donation Requests
- `POST /api/donation-requests` - Create a donation request
- `GET /api/donation-requests` - Get all donation requests
- `GET /api/donation-requests/:id` - Get request by ID
- `PATCH /api/donation-requests/:id/status` - Update request status

### 3. CORS Configuration

Make sure your backend has CORS enabled. In your Express backend:

```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:8080', // Your frontend URL
  credentials: true
}));
```

### 4. Request/Response Format

All API endpoints should return responses in this format:

```json
{
  "success": true,
  "data": { /* your data here */ },
  "message": "Optional success message"
}
```

For errors:

```json
{
  "success": false,
  "error": "Error message here"
}
```

## Files Modified

The following files have been updated to remove Supabase and use REST API calls:

1. **`src/services/api.ts`** - New API service layer
2. **`src/pages/Donate.tsx`** - Food donation form
3. **`src/pages/RegisterOrganization.tsx`** - Organization registration form
4. **`src/pages/Auth.tsx`** - Authentication (sign up/sign in)
5. **`src/config/backend.ts`** - Backend configuration
6. **`src/App.tsx`** - Removed Supabase imports

## Files/Folders to Remove (Optional)

Since you're no longer using Supabase, you can optionally remove:

- `src/integrations/supabase/` folder
- `supabase/` folder (edge functions, migrations, etc.)
- `@supabase/supabase-js` dependency

## Development

1. Start your Node.js/Express backend on port 5000 (or update the URL)
2. Start the React frontend: `npm run dev`
3. The frontend will make API calls to your backend

## Production Deployment

1. Update `BASE_URL` in `src/services/api.ts` to your production backend URL
2. Ensure your production backend has proper CORS configuration
3. Deploy your backend and frontend separately
4. Update environment variables as needed

## Troubleshooting

### CORS Errors
- Make sure CORS is enabled on your backend
- Check that the origin in CORS config matches your frontend URL

### 404 Errors
- Verify all API endpoint paths match between frontend and backend
- Check your backend is running and accessible

### Connection Refused
- Ensure your backend is running
- Verify the `BASE_URL` is correct
- Check firewall/network settings
