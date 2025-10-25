# API Setup Guide for HopeHUB

This guide will help you configure the external APIs used in the HopeHUB application.

## Required API Keys

### 1. Brevo (Email Service) - **REQUIRED for Email Notifications**

When a user requests food or resources, the system sends email notifications to all registered users and organizations using Brevo.

**Setup Steps:**
1. Sign up for a free account at [Brevo](https://www.brevo.com)
2. Navigate to Settings → API Keys
3. Create a new API key
4. Create a `.env` file in the `backend` directory (copy from `.env.example`)
5. Add your Brevo API key:
   ```
   BREVO_API_KEY=your-actual-brevo-api-key-here
   ```

**Note:** Without this key, email notifications will be skipped but the app will continue to function.

---

### 2. OpenWeatherMap (Weather Service) - **OPTIONAL**

Used to display weather information on location pages.

**Setup Steps:**
1. Sign up for a free account at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your API key from the API keys section
3. Update the key in `/frontend/src/config/apiConfig.ts`:
   ```typescript
   weather: {
     openWeatherMap: {
       publicKey: 'your-openweathermap-api-key-here',
     }
   }
   ```

**Note:** Without this key, weather features will be disabled but the app will work normally.

---

### 3. Mapbox (Maps Service) - **CONFIGURED**

Already configured with a working API key. No action needed unless you want to use your own key.

**Optional Setup:**
1. Sign up at [Mapbox](https://www.mapbox.com)
2. Get your public token
3. Update in `/frontend/src/config/apiConfig.ts`:
   ```typescript
   maps: {
     mapbox: {
       publicKey: 'your-mapbox-token-here',
     }
   }
   ```

---

## Backend Database Configuration

The backend requires a PostgreSQL database connection:

1. Update `backend/.env` with your database URL:
   ```
   DATABASE_URL=postgres://USER:PASS@localhost:5432/hopehub
   ```

2. Run migrations:
   ```bash
   cd backend
   npm run migrate
   ```

---

## Testing the Setup

### Email Notifications (Brevo)
1. Register a user or organization
2. Create a food request
3. Check if emails are sent to registered users

### Weather API
1. Go to Register Organization or Register Food Donation
2. Click "Use My Location"
3. Weather information should display below the map

### Maps (Mapbox)
1. Click "Use My Location" on any registration form
2. A map preview should appear showing your location

---

## Troubleshooting

### Email not working?
- Check that `BREVO_API_KEY` is set in `backend/.env`
- Verify the API key is valid in your Brevo dashboard
- Check backend console for error messages

### Weather not showing?
- Verify the OpenWeatherMap API key is valid
- Check browser console for API errors
- Free tier has rate limits (60 calls/minute)

### Maps not loading?
- Check browser console for Mapbox errors
- Verify the token is correct in `apiConfig.ts`
- Check Mapbox dashboard for usage limits

---

## Optional APIs

The following APIs are optional and not required for core functionality:

- **Google Maps**: Alternative to Mapbox
- **Twilio**: For SMS notifications (not implemented)
- **Stripe/Razorpay**: For payment processing (not implemented)
- **Google Analytics**: For tracking (not implemented)

Refer to `/frontend/src/config/apiConfig.ts` for more details on these integrations.
