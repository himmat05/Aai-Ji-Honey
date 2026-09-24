import apiClient from './apiClient';

export const cartApi = {
  /**
   * Get current authenticated user's cart from NeonDB
   */
  getCart: async (coupon = null) => {
    const params = coupon ? { coupon } : {};
    const res = await apiClient.get('/api/cart', { params });
    return res.data;
  },

  /**
   * Add item to authenticated user's cart
   */
  addItem: async ({ productId, quantity = 1, coupon = null }) => {
    const res = await apiClient.post('/api/cart/items', { productId, quantity, coupon });
    return res.data;
  },

  /**
   * Update item quantity in authenticated user's cart
   */
  updateQuantity: async (productId, quantity, coupon = null) => {
    const res = await apiClient.patch(`/api/cart/items/${productId}`, { quantity, coupon });
    return res.data;
  },

  /**
   * Remove item from authenticated user's cart
   */
  removeItem: async (productId, coupon = null) => {
    const params = coupon ? { coupon } : {};
    const res = await apiClient.delete(`/api/cart/items/${productId}`, { params });
    return res.data;
  },

  /**
   * Clear all items from authenticated user's cart
   */
  clearCart: async () => {
    const res = await apiClient.delete('/api/cart');
    return res.data;
  },

  /**
   * Move item from Cart to Saved for Later
   */
  saveForLater: async (productId, coupon = null) => {
    const res = await apiClient.post(`/api/cart/save-for-later/${productId}`, { coupon });
    return res.data;
  },

  /**
   * Move item from Saved for Later back to Cart
   */
  moveToCart: async (productId, coupon = null) => {
    const res = await apiClient.post(`/api/cart/move-to-cart/${productId}`, { coupon });
    return res.data;
  },

  /**
   * Remove item from Saved for Later
   */
  removeSavedItem: async (productId, coupon = null) => {
    const params = coupon ? { coupon } : {};
    const res = await apiClient.delete(`/api/cart/saved/${productId}`, { params });
    return res.data;
  },

  /**
   * Merge Guest Cart into User's Account Cart upon login
   */
  mergeGuestCart: async (items = [], coupon = null) => {
    const res = await apiClient.post('/api/cart/merge', { items, coupon });
    return res.data;
  },

  /**
   * Validate any cart (Guest or Authenticated) against live NeonDB products
   */
  validateCart: async ({ items = [], savedForLater = [], coupon = null } = {}) => {
    const res = await apiClient.post('/api/cart/validate', { items, savedForLater, coupon });
    return res.data;
  },

  /**
   * Get available public coupons
   */
  getAvailableCoupons: async () => {
    const res = await apiClient.get('/api/cart/coupons');
    return res.data;
  },
};
