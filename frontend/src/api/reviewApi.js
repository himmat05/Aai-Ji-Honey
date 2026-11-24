import apiClient from './apiClient';

export const reviewApi = {
  // Public Methods
  getReviews: async (params = {}) => {
    const response = await apiClient.get('/reviews', { params });
    return response.data;
  },

  createReview: async (formData) => {
    const response = await apiClient.post('/reviews', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Admin Moderation Methods
  getAdminReviews: async () => {
    const response = await apiClient.get('/reviews/admin');
    return response.data;
  },

  deleteReview: async (id) => {
    const response = await apiClient.delete(`/reviews/${id}`);
    return response.data;
  },

  toggleReviewApproval: async (id) => {
    const response = await apiClient.patch(`/reviews/${id}/toggle-approval`);
    return response.data;
  },
};
