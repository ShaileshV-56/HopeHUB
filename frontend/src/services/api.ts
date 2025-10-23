// API service for backend communication
// Update the BASE_URL to point to your Node.js/Express backend

import { API_URL } from '@/config/backend';
import { createApiClient, ApiResponse } from 'api/client';
const BASE_URL = API_URL; // Centralized backend URL

const apiCall = createApiClient(BASE_URL);

// Blood Donor APIs
export const bloodDonorApi = {
  register: async (donorData: any) => {
    return apiCall('/donors/register', {
      method: 'POST',
      body: JSON.stringify(donorData),
    });
  },

  getAll: async (filters?: any) => {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : '';
    return apiCall(`/donors${queryParams}`, {
      method: 'GET',
    });
  },

  getById: async (id: string) => {
    return apiCall(`/donors/${id}`, {
      method: 'GET',
    });
  },

  update: async (id: string, donorData: any) => {
    return apiCall(`/donors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(donorData),
    });
  },
};

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
