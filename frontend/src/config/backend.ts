/**
 * Backend Configuration
 * 
 * Update this file with your Node.js/Express backend URL
 */

// Development backend URL
export const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://hopehub-backend.onrender.com';

// API base path
export const API_BASE_PATH = '/api';

// Full API URL
export const API_URL = `${BACKEND_URL}${API_BASE_PATH}`;

// API Endpoints
export const ENDPOINTS = {
  // Authentication
  AUTH: {
    SIGNUP: '/auth/signup',
    SIGNIN: '/auth/signin',
    SIGNOUT: '/auth/signout',
    ME: '/auth/me',
  },
  
  // Blood donors removed
  
  // Food Donations
  FOOD_DONATIONS: {
    SUBMIT: '/donations/food',
    GET_ALL: '/donations/food',
    GET_BY_ID: (id: string) => `/donations/food/${id}`,
    UPDATE: (id: string) => `/donations/food/${id}`,
    UPDATE_STATUS: (id: string) => `/donations/food/${id}/status`,
  },
  
  // Helper Organizations
  ORGANIZATIONS: {
    REGISTER: '/organizations/register',
    GET_ALL: '/organizations',
    GET_BY_ID: (id: string) => `/organizations/${id}`,
    UPDATE: (id: string) => `/organizations/${id}`,
  },
  
  // Donation Requests
  DONATION_REQUESTS: {
    CREATE: '/donation-requests',
    GET_ALL: '/donation-requests',
    GET_BY_ID: (id: string) => `/donation-requests/${id}`,
    UPDATE_STATUS: (id: string) => `/donation-requests/${id}/status`,
  },
};

/**
 * Instructions for production deployment:
 * 
 * 1. Update BACKEND_URL to your production backend URL
 * 2. Ensure your backend has CORS enabled for your frontend domain
 * 3. Make sure all API endpoints match your backend routes
 * 4. Consider adding authentication tokens to API requests
 */
