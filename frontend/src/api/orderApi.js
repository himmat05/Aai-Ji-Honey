import apiClient from './apiClient';

export const orderApi = {
  createOrder: async (orderData) => {
    const response = await apiClient.post('/orders', orderData);
    return response.data;
  },

  getOrders: async (page = 1, limit = 10) => {
    const response = await apiClient.get('/orders', {
      params: { page, limit },
    });
    return response.data;
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await apiClient.patch(`/orders/${orderId}`, { status });
    return response.data;
  },

  deleteOrder: async (orderId) => {
    const response = await apiClient.delete(`/orders/${orderId}`);
    return response.data;
  },

  /**
   * Get orders placed by current authenticated customer
   */
  getMyOrders: async () => {
    const response = await apiClient.get('/orders/my-orders');
    return response.data;
  },
};
