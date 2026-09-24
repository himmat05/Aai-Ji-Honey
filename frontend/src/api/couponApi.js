import apiClient from './apiClient';

export const couponApi = {
  /**
   * Get active coupons for public cart users
   */
  getPublicCoupons: async () => {
    const response = await apiClient.get('/api/coupons');
    return response.data;
  },

  /**
   * Get all coupons for store Admin (active & inactive)
   */
  getAdminCoupons: async () => {
    const response = await apiClient.get('/api/coupons/admin');
    return response.data;
  },

  /**
   * Create a new coupon (Admin only)
   */
  createCoupon: async (couponData) => {
    const response = await apiClient.post('/api/coupons/admin', couponData);
    return response.data;
  },

  /**
   * Delete a coupon by ID (Admin only)
   */
  deleteCoupon: async (id) => {
    const response = await apiClient.delete(`/api/coupons/admin/${id}`);
    return response.data;
  },

  /**
   * Toggle coupon active/inactive status (Admin only)
   */
  toggleCouponStatus: async (id) => {
    const response = await apiClient.patch(`/api/coupons/admin/${id}/toggle`);
    return response.data;
  },
};

export default couponApi;
