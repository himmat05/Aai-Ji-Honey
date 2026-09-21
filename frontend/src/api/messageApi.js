import apiClient from './apiClient';

export const messageApi = {
  /**
   * Submit a new direct message or inquiry (Guest or Authenticated User)
   * @param {Object} data - { name, email, mobile, subject, message }
   */
  sendMessage: async (data) => {
    const response = await apiClient.post('/messages', data);
    return response.data;
  },

  /**
   * Get all messages for Store Admin Dashboard
   * @param {string} status - 'all' | 'unread' | 'replied'
   */
  getAllMessages: async (status = 'all') => {
    const response = await apiClient.get('/messages', {
      params: { status },
    });
    return response.data;
  },

  /**
   * Store Admin reply to a customer message
   * @param {string} id - Message ID
   * @param {string} reply - Official response text
   */
  replyToMessage: async (id, reply) => {
    const response = await apiClient.post(`/messages/${id}/reply`, { reply });
    return response.data;
  },

  /**
   * Get message history and replies for the currently logged-in customer
   */
  getMyMessages: async () => {
    const response = await apiClient.get('/messages/my-messages');
    return response.data;
  },

  /**
   * Mark a message as read (either by Admin or Customer)
   * @param {string} id - Message ID
   */
  markAsRead: async (id) => {
    const response = await apiClient.patch(`/messages/${id}/read`);
    return response.data;
  },

  /**
   * Fetch unread notification counts for Navbar badges
   * @returns {Promise<{ adminUnread: number, userUnread: number }>}
   */
  getUnreadCounts: async () => {
    const response = await apiClient.get('/messages/unread-count');
    return response.data;
  },
};

export default messageApi;
