import apiClient from './apiClient';

export const paymentApi = {
  createOrder: async (amountInPaise) => {
    const response = await apiClient.post('/create-order', { amount: amountInPaise });
    return response.data;
  },

  verifyPayment: async (paymentData) => {
    const response = await apiClient.post('/verify', paymentData);
    return response.data;
  },
};
