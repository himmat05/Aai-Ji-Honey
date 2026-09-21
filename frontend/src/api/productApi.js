import apiClient from './apiClient';

export const productApi = {
  getProducts: async () => {
    const response = await apiClient.get('/products');
    return response.data;
  },

  addProduct: async (formData) => {
    const response = await apiClient.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  updateProduct: async (id, formData) => {
    const response = await apiClient.put(`/products/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response.data;
  },

  rateProduct: async (id, { rating, review }) => {
    const response = await apiClient.post(`/products/${id}/rate`, { rating, review });
    return response.data;
  },

  getMyRating: async (id) => {
    const response = await apiClient.get(`/products/${id}/my-rating`);
    return response.data;
  },
};
