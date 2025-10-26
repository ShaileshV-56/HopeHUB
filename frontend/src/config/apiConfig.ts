/**
 * External API Configuration
 * 
 * This file contains configuration for various external API integrations.
 * 
 * SECURITY NOTE:
 * - Never store sensitive API keys in this file for production
 * - Use your Node/Express backend for server-side API calls
 * - Only store public/publishable keys here
 */

// ============================================
// API ENDPOINTS
// ============================================

export const API_ENDPOINTS = {
  // Email Service (handled by backend integration)
  email: {
    endpoint: '/api/integrations/email',
    description: 'Send emails via backend (requires server-side RESEND_API_KEY)',
  },

  // SMS/Messaging Services
  messaging: {
    twilio: {
      endpoint: 'https://api.twilio.com/2010-04-01',
      description: 'Send SMS via Twilio (requires TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN)',
    },
    whatsapp: {
      endpoint: 'https://api.whatsapp.com/send',
      description: 'WhatsApp messaging (client-side redirect)',
    },
  },

  // Weather Services
  weather: {
    openWeatherMap: {
      endpoint: 'https://api.openweathermap.org/data/2.5',
      description: 'Weather data from OpenWeatherMap',
      publicKey: '',
    },
    weatherAPI: {
      endpoint: 'https://api.weatherapi.com/v1',
      description: 'Weather data from WeatherAPI.com',
      publicKey: '', // Add your API key here
    },
  },

  // AI Services
  ai: {
    openai: {
      endpoint: '/api/ai/chat',
      description: 'OpenAI proxy via backend',
    },
    perplexity: {
      endpoint: '/api/ai/search',
      description: 'Perplexity proxy via backend',
    },
  },

  // Payment Services
  payment: {
    stripe: {
      publishableKey: '', // Add your Stripe publishable key here (safe for client-side)
      description: 'Stripe payment processing',
    },
    razorpay: {
      keyId: '', // Add your Razorpay key ID here (public key)
      description: 'Razorpay payment gateway',
    },
  },

  // Maps & Location
  maps: {
    googleMaps: {
      endpoint: 'https://maps.googleapis.com/maps/api',
      publicKey: '', // Add your Google Maps API key here
      description: 'Google Maps integration',
    },
    mapbox: {
      endpoint: 'https://api.mapbox.com',
      publicKey: 'pk.eyJ1Ijoic2hhaWxlc2gtNTYiLCJhIjoiY21jYjV3MW1sMDlubjJsc2FyN3BxbXJmayJ9.qrIUd4rF1kPwlQahNrTo1g',
      description: 'Mapbox maps and geocoding',
    },
  },

  // Social Media
  social: {
    twitter: {
      shareUrl: 'https://twitter.com/intent/tweet',
      description: 'Twitter/X sharing',
    },
    facebook: {
      shareUrl: 'https://www.facebook.com/sharer/sharer.php',
      description: 'Facebook sharing',
    },
  },

  // Analytics
  analytics: {
    googleAnalytics: {
      measurementId: '', // Add your GA4 Measurement ID here
      description: 'Google Analytics 4',
    },
  },

  // Automation
  automation: {
    zapier: {
      webhookUrl: '', // Add your Zapier webhook URL here
      description: 'Zapier automation triggers',
    },
    make: {
      webhookUrl: '', // Add your Make.com webhook URL here
      description: 'Make.com automation',
    },
  },

  // Emergency section trimmed; blood integrations removed
};

// ============================================
// API CONFIGURATION TYPES
// ============================================

export interface EmailConfig {
  from: string;
  replyTo?: string;
  defaultSubject?: string;
}

export interface SMSConfig {
  fromNumber: string;
  countryCode: string;
}

export interface WeatherConfig {
  units: 'metric' | 'imperial';
  language: string;
}

// ============================================
// DEFAULT CONFIGURATIONS
// ============================================

export const DEFAULT_CONFIGS = {
  email: {
    from: 'HopeHUB <noreply@hopehub.com>',
    replyTo: 'support@hopehub.com',
  } as EmailConfig,

  sms: {
    fromNumber: '+1234567890', // Update with your number
    countryCode: '+1',
  } as SMSConfig,

  weather: {
    units: 'metric',
    language: 'en',
  } as WeatherConfig,
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Format WhatsApp URL with message
 */
export const formatWhatsAppUrl = (phone: string, message: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
};

/**
 * Format email subject and body for mailto links
 */
export const formatMailtoUrl = (email: string, subject: string, body: string): string => {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  return `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
};

/**
 * Format Twitter share URL
 */
export const formatTwitterShareUrl = (text: string, url?: string): string => {
  const params = new URLSearchParams({ text });
  if (url) params.append('url', url);
  return `${API_ENDPOINTS.social.twitter.shareUrl}?${params.toString()}`;
};

/**
 * Format Facebook share URL
 */
export const formatFacebookShareUrl = (url: string): string => {
  return `${API_ENDPOINTS.social.facebook.shareUrl}?u=${encodeURIComponent(url)}`;
};

/**
 * Get weather icon URL
 */
export const getWeatherIconUrl = (iconCode: string, service: 'openweather' | 'weatherapi' = 'openweather'): string => {
  if (service === 'openweather') {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }
  return `https:${iconCode}`;
};

// Use backend endpoints for all secret-bound integrations.

// ============================================
// USAGE EXAMPLES
// ============================================

/**
 * Example: Send email via backend
 * 
 * await fetch(API_ENDPOINTS.email.endpoint, {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     to: 'user@example.com',
 *     subject: 'Welcome to HopeHUB',
 *     html: '<h1>Welcome!</h1>',
 *   }),
 * });
 */

/**
 * Example: Get weather data
 * 
 * const apiKey = API_ENDPOINTS.weather.openWeatherMap.publicKey;
 * const response = await fetch(
 *   `${API_ENDPOINTS.weather.openWeatherMap.endpoint}/weather?q=London&appid=${apiKey}&units=metric`
 * );
 * const weatherData = await response.json();
 */

/**
 * Example: Trigger Zapier webhook
 * 
 * const webhookUrl = API_ENDPOINTS.automation.zapier.webhookUrl;
 * await fetch(webhookUrl, {
 *   method: 'POST',
 *   mode: 'no-cors',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({ event: 'donor_registered', data: donorData }),
 * });
 */

export default API_ENDPOINTS;
