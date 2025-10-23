# API Configuration Guide

This directory contains configuration files for external API integrations in HopeHUB.

## 📁 Files

- **`apiConfig.ts`** - Main configuration file for all external APIs

## 🔒 Security Best Practices

### Public vs Secret Keys

**✅ Safe to store in `apiConfig.ts` (Client-side):**
- Stripe Publishable Key
- Google Maps API Key (with restrictions)
- Mapbox Public Token
- Google Analytics Measurement ID
- Any API marked as "public" or "publishable"

**❌ NEVER store in `apiConfig.ts`:**
- Stripe Secret Key
- Twilio Auth Token
- OpenAI API Key
- Resend API Key
- Database credentials
- Any API marked as "secret" or "private"

### Using Secret Keys

For secret keys, use **Supabase Edge Functions**:

1. Add secret to Supabase:
   ```bash
   # Go to: https://supabase.com/dashboard/project/suehzckzvcqtfndaypmo/settings/functions
   # Add your secret there
   ```

2. Create Edge Function to use the secret:
   ```typescript
   // supabase/functions/my-function/index.ts
   const apiKey = Deno.env.get('MY_SECRET_KEY');
   ```

3. Call from frontend:
   ```typescript
   import { callEdgeFunction } from '@/config/apiConfig';
   
   const { data, error } = await callEdgeFunction('my-function', {
     param1: 'value1'
   });
   ```

## 🚀 Adding New Integrations

### Step 1: Add to `apiConfig.ts`

```typescript
export const API_ENDPOINTS = {
  // ... existing endpoints
  
  myNewService: {
    endpoint: 'https://api.example.com/v1',
    publicKey: '', // Only if public key
    description: 'Description of the service',
  },
};
```

### Step 2: Create Edge Function (if needed)

If the API requires secret keys:

```bash
# Create new edge function
# File: supabase/functions/my-new-service/index.ts
```

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('MY_SERVICE_API_KEY');
    const { param1 } = await req.json();

    // Your API logic here
    const response = await fetch('https://api.example.com/endpoint', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ param1 }),
    });

    const data = await response.json();

    return new Response(
      JSON.stringify({ success: true, data }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
```

### Step 3: Use in Your Components

```typescript
import { callEdgeFunction, API_ENDPOINTS } from '@/config/apiConfig';

// Using Edge Function
const { data, error } = await callEdgeFunction('my-new-service', {
  param1: 'value'
});

// Using public API directly
const response = await fetch(`${API_ENDPOINTS.myNewService.endpoint}/data`, {
  headers: {
    'Authorization': `Bearer ${API_ENDPOINTS.myNewService.publicKey}`,
  },
});
```

## 📚 Common Integration Examples

### 1. Email Integration (Resend)

**Setup:**
1. Sign up at https://resend.com
2. Verify your domain at https://resend.com/domains
3. Create API key at https://resend.com/api-keys
4. Add `RESEND_API_KEY` to Supabase secrets

**Usage:**
```typescript
import { callEdgeFunction } from '@/config/apiConfig';

await callEdgeFunction('send-email', {
  to: 'user@example.com',
  subject: 'Welcome!',
  html: '<h1>Hello!</h1>',
});
```

### 2. SMS Integration (Twilio)

**Setup:**
1. Sign up at https://www.twilio.com
2. Get Account SID and Auth Token
3. Add to Supabase secrets
4. Create Edge Function for SMS

**Usage:**
```typescript
await callEdgeFunction('send-sms', {
  to: '+1234567890',
  message: 'Your verification code is 123456',
});
```

### 3. Weather Integration

**Setup:**
1. Sign up at https://openweathermap.org/api
2. Get free API key
3. Add to `apiConfig.ts` (it's public)

**Usage:**
```typescript
import { API_ENDPOINTS } from '@/config/apiConfig';

const apiKey = API_ENDPOINTS.weather.openWeatherMap.publicKey;
const city = 'London';
const response = await fetch(
  `${API_ENDPOINTS.weather.openWeatherMap.endpoint}/weather?q=${city}&appid=${apiKey}&units=metric`
);
const data = await response.json();
```

### 4. Zapier Automation

**Setup:**
1. Create a Zap at https://zapier.com
2. Add a Webhook trigger
3. Copy the webhook URL
4. Add to `apiConfig.ts`

**Usage:**
```typescript
import { API_ENDPOINTS } from '@/config/apiConfig';

await fetch(API_ENDPOINTS.automation.zapier.webhookUrl, {
  method: 'POST',
  mode: 'no-cors',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    event: 'donor_registered',
    data: { name: 'John Doe', bloodGroup: 'O+' },
  }),
});
```

### 5. Payment Integration (Stripe)

**Setup:**
1. Sign up at https://stripe.com
2. Get publishable key (safe for client)
3. Add secret key to Supabase secrets
4. Add publishable key to `apiConfig.ts`

**Usage:**
```typescript
import { loadStripe } from '@stripe/stripe-js';
import { API_ENDPOINTS } from '@/config/apiConfig';

const stripe = await loadStripe(API_ENDPOINTS.payment.stripe.publishableKey);

// Create payment session via Edge Function
const { data } = await callEdgeFunction('create-payment', {
  amount: 5000, // $50.00
  currency: 'usd',
});
```

## 🔗 Useful Links

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Supabase Secrets Management](https://supabase.com/dashboard/project/suehzckzvcqtfndaypmo/settings/functions)
- [Edge Functions Dashboard](https://supabase.com/dashboard/project/suehzckzvcqtfndaypmo/functions)

## 📝 Notes

- Always test API integrations in development before production
- Monitor API usage and costs
- Set up proper error handling for all API calls
- Use rate limiting when necessary
- Keep API documentation links handy
- Update this README when adding new integrations
