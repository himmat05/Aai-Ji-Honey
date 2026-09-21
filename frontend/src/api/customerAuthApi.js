import apiClient from './apiClient';

export const customerAuthApi = {
  /**
   * Request OTP for new account creation
   * @param {{ name: string, email: string, mobile: string, password: string }} data
   */
  sendSignupOtp: async (data) => {
    const response = await apiClient.post('/auth/send-signup-otp', data);
    return response.data;
  },

  /**
   * Submit OTP and complete user registration
   * @param {{ name: string, email: string, mobile: string, password: string, otp: string }} data
   */
  verifySignupOtp: async (data) => {
    const response = await apiClient.post('/auth/verify-signup-otp', data);
    return response.data;
  },

  /**
   * Manual Customer Login with email & password
   * @param {{ email: string, password: string }} credentials
   */
  userLogin: async (credentials) => {
    const response = await apiClient.post('/auth/user-login', credentials);
    return response.data;
  },

  /**
   * Google OAuth Login / Signup
   * @param {{ credential?: string, code?: string, redirectUri?: string }} payload
   */
  googleAuth: async (payload) => {
    const response = await apiClient.post('/auth/google', payload);
    return response.data;
  },

  /**
   * Request OTP for password reset
   * @param {{ email: string }} data
   */
  sendForgotPasswordOtp: async (data) => {
    const response = await apiClient.post('/auth/forgot-password/send-otp', data);
    return response.data;
  },

  /**
   * Submit OTP and new password
   * @param {{ email: string, otp: string, newPassword: string }} data
   */
  resetPassword: async (data) => {
    const response = await apiClient.post('/auth/forgot-password/reset', data);
    return response.data;
  },

  /**
   * Fetch current authenticated user / owner profile
   */
  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  /**
   * Update customer profile (name, mobile, address, location)
   * @param {{ name?: string, mobile?: string, address?: string, location?: string }} data
   */
  updateProfile: async (data) => {
    const response = await apiClient.put('/auth/profile', data);
    return response.data;
  },
};
