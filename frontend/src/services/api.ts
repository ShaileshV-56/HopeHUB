// API service for backend communication
// Update the BASE_URL to point to your Node.js/Express backend

import { API_URL } from '@/config/backend';
import { createApiClient, ApiResponse } from 'api/client';
const BASE_URL = API_URL; // Centralized backend URL

const apiCall = createApiClient(BASE_URL);

// Removed blood donor APIs

// Food Donation APIs
export const foodDonationApi = {
  submit: async (donationData: any) => {
    return apiCall('/donations/food', {
      method: 'POST',
      body: JSON.stringify(donationData),
    });
  },

  getAll: async (filters?: any) => {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return apiCall(`/donations/food${queryParams}`, {
      method: 'GET',
    });
  },

  getById: async (id: string) => {
    return apiCall(`/donations/food/${id}`, {
      method: 'GET',
    });
  },

  update: async (id: string, donationData: any) => {
    return apiCall(`/donations/food/${id}`, {
      method: 'PUT',
      body: JSON.stringify(donationData),
    });
  },

  updateStatus: async (id: string, status: string) => {
    return apiCall(`/donations/food/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  remove: async (id: string) => {
    return apiCall(`/donations/food/${id}`, {
      method: 'DELETE',
    });
  },
};

// Helper Organization APIs
export const helperOrgApi = {
  register: async (orgData: any) => {
    return apiCall('/organizations/register', {
      method: 'POST',
      body: JSON.stringify(orgData),
    });
  },

  getAll: async (filters?: any) => {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return apiCall(`/organizations${queryParams}`, {
      method: 'GET',
    });
  },

  getById: async (id: string) => {
    return apiCall(`/organizations/${id}`, {
      method: 'GET',
    });
  },

  update: async (id: string, orgData: any) => {
    return apiCall(`/organizations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(orgData),
    });
  },

  remove: async (id: string) => {
    return apiCall(`/organizations/${id}`, {
      method: 'DELETE',
    });
  },
};

// Donation Request APIs
export const donationRequestApi = {
  create: async (requestData: any) => {
    return apiCall('/donation-requests', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  },

  getAll: async (filters?: any) => {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return apiCall(`/donation-requests${queryParams}`, {
      method: 'GET',
    });
  },

  getById: async (id: string) => {
    return apiCall(`/donation-requests/${id}`, {
      method: 'GET',
    });
  },

  updateStatus: async (id: string, status: string) => {
    return apiCall(`/donation-requests/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

// Food Requests APIs (recipients requesting aid)
export const foodRequestApi = {
  create: async (data: any) => {
    return apiCall('/food-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  pledge: async (id: string, quantity: string) => {
    return apiCall(`/food-requests/${id}/pledges`, {
      method: 'POST',
      body: JSON.stringify({ quantity }),
    });
  },
  getAll: async () => {
    return apiCall('/food-requests', {
      method: 'GET',
    });
  },
  getById: async (id: string) => {
    return apiCall(`/food-requests/${id}`, {
      method: 'GET',
    });
  },
  update: async (id: string, data: any) => {
    return apiCall(`/food-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Chatbot API
export const chatApi = {
  send: async (messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>) => {
    return apiCall('/chat', {
      method: 'POST',
      body: JSON.stringify({ messages }),
    });
  },
};

// Authentication APIs
export const authApi = {
  signup: async (userData: { name: string; email: string; password: string }) => {
    return apiCall('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  signin: async (credentials: { email: string; password: string }) => {
    return apiCall('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  signout: async () => {
    return apiCall('/auth/signout', {
      method: 'POST',
    });
  },

  getCurrentUser: async () => {
    return apiCall('/auth/me', {
      method: 'GET',
    });
  },
};

// Export BASE_URL for configuration
export { BASE_URL };

// Dashboard APIs
export const dashboardApi = {
  getStats: async () => {
    return apiCall('/stats', {
      method: 'GET',
    });
  },
};
