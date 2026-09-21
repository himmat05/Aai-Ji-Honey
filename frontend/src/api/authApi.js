import apiClient from './apiClient';

export const authApi = {
  login: async (credentials) => {
    const response = await apiClient.post('/login', credentials);
    return response.data;
  },

  registerOwner: async (credentials) => {
    const response = await apiClient.post('/register-owner', credentials);
    return response.data;
  },
};
