import apiClient from './apiClient';

export const paymentApi = {
  /**
   * Request server to create a Razorpay order
   * Sends productId and quantity so amount is calculated and enforced server-side
   * @param {Object|number} payload - { productId, quantity } or legacy amount
   * @returns {Promise<{ order: Object, keyId: string, product: Object }>}
   */
  createOrder: async (payload) => {
    const data = typeof payload === 'object' ? payload : { amount: payload };
    const response = await apiClient.post('/create-order', data);
    return response.data;
  },

  /**
   * Verify HMAC-SHA256 signature server-side and persist order
   * @param {Object} verificationData - { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderDetails }
   * @returns {Promise<{ success: boolean, order: Object }>}
   */
  verifyPayment: async (verificationData) => {
    const response = await apiClient.post('/verify', verificationData);
    return response.data;
  },
};
