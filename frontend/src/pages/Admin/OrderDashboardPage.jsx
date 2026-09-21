import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderApi } from '../../api/orderApi';
import { messageApi } from '../../api/messageApi';
import { printTaxInvoice } from '../../utils/invoicePrinter';
import { formatDate } from '../../utils/formatters';

const OrderDashboardPage = () => {
  // Main Tab: 'orders' or 'messages'
  const [activeMainTab, setActiveMainTab] = useState('orders');

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderFilter, setOrderFilter] = useState('all');

  // Messages State
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageFilter, setMessageFilter] = useState('all');
  const [messageSearch, setMessageSearch] = useState('');
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const data = await orderApi.getOrders(1, 100);
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
      toast.error('❌ Failed to fetch orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchMessages = async () => {
    try {
      setLoadingMessages(true);
      const data = await messageApi.getAllMessages();
      setMessages(data.messages || []);
      setUnreadMessagesCount(data.unreadCount || 0);
    } catch (err) {
      console.error('Error fetching messages:', err);
      toast.error('❌ Failed to fetch messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchMessages();
  }, []);

  const markCompleted = async (id) => {
    try {
      await orderApi.updateOrderStatus(id, 'Completed');
      toast.success('✅ Order marked as completed');
      fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error('❌ Failed to update order status');
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this order?')) return;

    try {
      await orderApi.deleteOrder(id);
      setOrders((prev) => prev.filter((order) => order._id !== id));
      toast.success('✅ Order deleted successfully');
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('❌ Failed to delete order');
    }
  };

  const handleSendReply = async (messageId) => {
    if (!replyText.trim()) {
      toast.error('Please write a reply before sending.');
      return;
    }

    try {
      setIsSendingReply(true);
      const res = await messageApi.replyToMessage(messageId, replyText.trim());
      toast.success('✉️ Reply saved and emailed to customer!');
      setReplyText('');
      setReplyingId(null);
      fetchMessages();
    } catch (err) {
      console.error('Reply error:', err);
      toast.error(err.response?.data?.error || 'Failed to send reply');
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleMarkMessageRead = async (messageId) => {
    try {
      await messageApi.markAsRead(messageId);
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, is_read_by_admin: true } : m))
      );
      setUnreadMessagesCount((prev) => Math.max(0, prev - 1));
      toast.success('Marked as read');
    } catch (e) {}
  };

  // Filtered Orders
  const pendingOrders = orders.filter((order) => order.status !== 'Completed');
  const completedOrders = orders.filter((order) => order.status === 'Completed');
  const filteredOrders =
    orderFilter === 'pending' ? pendingOrders : orderFilter === 'completed' ? completedOrders : orders;

  const totalRevenue = completedOrders.reduce((sum, order) => {
    const price = order.product?.price || 0;
    const qty = order.quantity || 1;
    return sum + price * qty;
  }, 0);

  // Filtered Messages
  const unreadMessages = messages.filter((m) => !m.is_read_by_admin || m.status === 'unread');
  const repliedMessages = messages.filter((m) => m.status === 'replied');

  const filteredMessages = messages
    .filter((m) => {
      if (messageFilter === 'unread') return !m.is_read_by_admin || m.status === 'unread';
      if (messageFilter === 'replied') return m.status === 'replied';
      return true;
    })
    .filter((m) => {
      if (!messageSearch.trim()) return true;
      const q = messageSearch.toLowerCase();
      return (
        m.name?.toLowerCase().includes(q) ||
        m.email?.toLowerCase().includes(q) ||
        m.subject?.toLowerCase().includes(q) ||
        m.message?.toLowerCase().includes(q) ||
        m.mobile?.includes(q)
      );
    });

  const renderOrderCard = (order) => (
    <div
      key={order._id}
      className="honey-glass honey-glass-hover rounded-3xl p-6 border border-amber-200/80 shadow-lg flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-4 pb-4 border-b border-amber-200/80">
          <div>
            <p className="text-[11px] font-black text-amber-700 uppercase tracking-widest">
              {order.invoiceNumber || 'INV-TEMP'}
            </p>
            <h3 className="text-xl font-black text-amber-950 mt-0.5 font-heading">
              {order.name}
            </h3>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-black shadow-sm flex items-center gap-1 ${
              order.status === 'Completed'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            {order.status === 'Completed' ? '✅ Completed' : '⏳ Pending'}
          </span>
        </div>

        {/* Product Details Box */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-amber-50/80 rounded-2xl p-3 border border-amber-200/60">
            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Honey Jar</p>
            <p className="font-extrabold text-amber-950 text-sm truncate">
              {order.product?.name || 'Artisanal Honey'}
            </p>
          </div>
          <div className="bg-amber-50/80 rounded-2xl p-3 border border-amber-200/60">
            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Quantity</p>
            <p className="font-extrabold text-amber-950 text-sm">
              × {order.quantity || 1}
            </p>
          </div>
          <div className="bg-amber-50/80 rounded-2xl p-3 border border-amber-200/60">
            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Unit Price</p>
            <p className="font-extrabold text-amber-950 text-sm">
              ₹{order.product?.price || 0}
            </p>
          </div>
          <div className="bg-orange-100/70 rounded-2xl p-3 border border-orange-200">
            <p className="text-[10px] font-bold text-orange-800 uppercase tracking-wider">Total Billed</p>
            <p className="font-black text-orange-950 text-sm">
              ₹{(order.product?.price || 0) * (order.quantity || 1)}
            </p>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white/80 rounded-2xl p-4 mb-4 border border-amber-100 space-y-2 text-xs text-gray-700">
          <p className="flex items-center gap-2">
            <strong className="text-amber-950 font-bold min-w-[70px]">📧 Email:</strong>
            <span className="truncate">{order.email || 'N/A'}</span>
          </p>
          <p className="flex items-center gap-2">
            <strong className="text-amber-950 font-bold min-w-[70px]">📱 Mobile:</strong>
            <span>{order.mobile || 'N/A'}</span>
          </p>
          <p className="flex items-start gap-2">
            <strong className="text-amber-950 font-bold min-w-[70px]">📍 Address:</strong>
            <span className="leading-relaxed">{order.address || 'N/A'}</span>
          </p>
          <p className="flex items-center gap-2">
            <strong className="text-amber-950 font-bold min-w-[70px]">💳 Payment:</strong>
            <span className="font-mono text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {order.paymentId || 'Cash / Verified'}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <strong className="text-amber-950 font-bold min-w-[70px]">📅 Date:</strong>
            <span>{formatDate(order.createdAt)}</span>
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-3 border-t border-amber-200/80">
        <button
          onClick={() => printTaxInvoice(order)}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors flex items-center justify-center gap-2 border border-amber-300 shadow-sm"
        >
          <span>🖨️</span>
          <span>Print Tax Invoice</span>
        </button>

        <div className="flex gap-2">
          {order.status !== 'Completed' && (
            <button
              onClick={() => markCompleted(order._id)}
              className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-md flex items-center justify-center gap-1.5"
            >
              <span>✓</span>
              <span>Mark Done</span>
            </button>
          )}

          <button
            onClick={() => handleDeleteOrder(order._id)}
            className="p-2.5 rounded-xl text-red-600 hover:bg-red-50 border border-red-200 hover:border-red-300 transition-colors"
            title="Delete Order Permanently"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );

  const renderMessageCard = (msg) => {
    const isUnread = !msg.is_read_by_admin || msg.status === 'unread';
    const isReplying = replyingId === msg.id;

    return (
      <div
        key={msg.id}
        className={`rounded-3xl p-6 transition-all duration-300 border shadow-lg flex flex-col justify-between ${
          isUnread
            ? 'bg-amber-50/90 border-amber-400/90 shadow-amber-200/40 ring-2 ring-amber-400/30'
            : 'honey-glass border-amber-200/80'
        }`}
      >
        <div>
          {/* Header */}
          <div className="flex items-start justify-between mb-4 pb-3 border-b border-amber-200/70">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-amber-950 font-heading">
                  {msg.name}
                </h3>
                {isUnread && (
                  <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider animate-pulse">
                    New
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-700 font-semibold mt-0.5">
                {msg.email} {msg.mobile && `• 📱 ${msg.mobile}`}
              </p>
            </div>

            <div className="text-right">
              <span
                className={`px-3 py-1 rounded-full text-xs font-black shadow-xs inline-flex items-center gap-1 ${
                  msg.status === 'replied'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-orange-100 text-orange-900 border border-orange-300'
                }`}
              >
                {msg.status === 'replied' ? '✅ Replied' : '⏳ Awaiting Reply'}
              </span>
              <p className="text-[11px] text-gray-500 mt-1">{formatDate(msg.created_at)}</p>
            </div>
          </div>

          {/* Subject & Message Content */}
          <div className="mb-4">
            <span className="inline-block px-2.5 py-0.5 rounded-lg bg-amber-200/80 text-amber-900 text-[11px] font-extrabold uppercase tracking-wider mb-2">
              🏷️ {msg.subject || 'General Inquiry'}
            </span>
            <div className="bg-white/90 rounded-2xl p-4 border border-amber-100 text-sm text-amber-950 leading-relaxed font-normal whitespace-pre-wrap">
              {msg.message}
            </div>
          </div>

          {/* Existing Admin Reply Box (If already replied) */}
          {msg.admin_reply && (
            <div className="bg-gradient-to-r from-amber-100/90 to-orange-100/80 border-l-4 border-amber-500 rounded-r-2xl p-4 mb-4 text-xs text-amber-950">
              <div className="flex items-center justify-between font-bold text-amber-900 uppercase tracking-wider text-[10px] mb-1">
                <span>🍯 Official Team Reply</span>
                {msg.replied_at && <span>{formatDate(msg.replied_at)}</span>}
              </div>
              <p className="whitespace-pre-wrap leading-relaxed text-sm font-medium">
                {msg.admin_reply}
              </p>
            </div>
          )}

          {/* Inline Reply Composer */}
          {isReplying && (
            <div className="mt-4 p-4 rounded-2xl bg-white border-2 border-amber-400 shadow-md space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-1">
                  <span>✉️</span> Reply to {msg.name}
                </span>
                <span className="text-[11px] text-gray-500">Will be emailed to: {msg.email}</span>
              </div>
              <textarea
                rows={3}
                className="w-full p-3 text-sm rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-amber-950 resize-y"
                placeholder={`Type your response to ${msg.name}... (This reply will be sent via email and appear in their website profile)`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setReplyingId(null);
                    setReplyText('');
                  }}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                  disabled={isSendingReply}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSendReply(msg.id)}
                  disabled={isSendingReply || !replyText.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 disabled:opacity-50 flex items-center gap-1.5 shadow-md"
                >
                  {isSendingReply ? 'Sending Email...' : 'Send Reply ✉️'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-between gap-2 pt-3 border-t border-amber-200/70 mt-2">
          {isUnread && (
            <button
              onClick={() => handleMarkMessageRead(msg.id)}
              className="px-3 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-100 rounded-lg transition-colors"
            >
              Mark Read ✓
            </button>
          )}

          {!isReplying && (
            <button
              onClick={() => {
                setReplyingId(msg.id);
                setReplyText(msg.admin_reply ? `Dear ${msg.name},\n\n` : `Dear ${msg.name},\n\nThank you for reaching out to Aai Ji Honey.\n\n`);
              }}
              className="ml-auto px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md flex items-center gap-1.5 transition-all duration-300"
            >
              <span>✉️</span>
              <span>{msg.admin_reply ? 'Send Another Reply' : 'Reply to Customer'}</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="relative pb-24 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full honey-glass border border-amber-300 shadow-sm mb-2">
              <span>👑</span>
              <span className="text-xs font-black text-amber-900 uppercase tracking-wider">
                Store Admin Portal
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-amber-950 font-heading tracking-tight">
              Management Dashboard
            </h1>
            <p className="text-sm text-amber-800 mt-1">
              Process customer honey deliveries, manage product inventory, and reply to direct inquiries.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                fetchOrders();
                fetchMessages();
                toast.info('Data refreshed');
              }}
              className="px-4 py-2.5 rounded-2xl honey-glass border border-amber-300 text-amber-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-100 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span>🔄</span>
              <span>Refresh</span>
            </button>

            <Link
              to="/add-product"
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 no-underline"
            >
              <span>🍯</span>
              <span>Manage Products</span>
            </Link>
          </div>
        </div>

        {/* Main Section Switcher Tabs: Orders vs Messages */}
        <div className="flex items-center gap-3 border-b-2 border-amber-200/80 pb-2">
          <button
            onClick={() => setActiveMainTab('orders')}
            className={`pb-2 px-5 font-black text-sm uppercase tracking-wider transition-all relative flex items-center gap-2 ${
              activeMainTab === 'orders'
                ? 'text-amber-950 border-b-4 border-amber-500 -mb-[10px]'
                : 'text-amber-800/70 hover:text-amber-950'
            }`}
          >
            <span>📦 Orders</span>
            <span className="bg-amber-100 text-amber-900 text-xs px-2.5 py-0.5 rounded-full font-black border border-amber-300">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveMainTab('messages')}
            className={`pb-2 px-5 font-black text-sm uppercase tracking-wider transition-all relative flex items-center gap-2 ${
              activeMainTab === 'messages'
                ? 'text-amber-950 border-b-4 border-amber-500 -mb-[10px]'
                : 'text-amber-800/70 hover:text-amber-950'
            }`}
          >
            <span>💬 Inquiries & Messages</span>
            {unreadMessagesCount > 0 ? (
              <span className="bg-red-500 text-white text-xs px-2.5 py-0.5 rounded-full font-black shadow-sm animate-pulse flex items-center gap-1">
                <span>🔴</span>
                <span>{unreadMessagesCount} unread</span>
              </span>
            ) : (
              <span className="bg-amber-100 text-amber-900 text-xs px-2.5 py-0.5 rounded-full font-black border border-amber-300">
                {messages.length}
              </span>
            )}
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: ORDERS CONTENT */}
        {/* ========================================================= */}
        {activeMainTab === 'orders' && (
          <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="honey-glass rounded-2xl p-5 border border-amber-200 shadow-sm">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                  Total Orders
                </span>
                <p className="text-3xl font-black text-amber-950 mt-1 font-heading">
                  {orders.length}
                </p>
              </div>

              <div className="honey-glass rounded-2xl p-5 border border-amber-200 shadow-sm">
                <span className="text-xs font-bold text-orange-700 uppercase tracking-wider block">
                  Pending Orders
                </span>
                <p className="text-3xl font-black text-orange-600 mt-1 font-heading">
                  {pendingOrders.length}
                </p>
              </div>

              <div className="honey-glass rounded-2xl p-5 border border-amber-200 shadow-sm">
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                  Completed Orders
                </span>
                <p className="text-3xl font-black text-emerald-700 mt-1 font-heading">
                  {completedOrders.length}
                </p>
              </div>

              <div className="honey-glass rounded-2xl p-5 border border-amber-200 shadow-sm">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
                  Total Revenue
                </span>
                <p className="text-3xl font-black text-amber-950 mt-1 font-heading">
                  ₹{totalRevenue}
                </p>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 p-1.5 rounded-2xl honey-glass border border-amber-200 max-w-fit shadow-sm">
              <button
                onClick={() => setOrderFilter('all')}
                className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                  orderFilter === 'all'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                    : 'text-amber-900 hover:bg-amber-100/60'
                }`}
              >
                All Orders ({orders.length})
              </button>

              <button
                onClick={() => setOrderFilter('pending')}
                className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                  orderFilter === 'pending'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                    : 'text-amber-900 hover:bg-amber-100/60'
                }`}
              >
                ⏳ Pending ({pendingOrders.length})
              </button>

              <button
                onClick={() => setOrderFilter('completed')}
                className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                  orderFilter === 'completed'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                    : 'text-amber-900 hover:bg-amber-100/60'
                }`}
              >
                ✅ Completed ({completedOrders.length})
              </button>
            </div>

            {/* Orders Grid */}
            {loadingOrders ? (
              <div className="text-center py-20">
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-amber-950 font-bold text-sm">Gathering orders from database... 🍯</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="honey-glass rounded-3xl p-12 text-center border border-amber-200 shadow-lg max-w-md mx-auto">
                <span className="text-5xl block mb-3 animate-bounce">📦</span>
                <p className="text-xl text-amber-950 font-black font-heading">
                  No orders in this category
                </p>
                <p className="text-xs text-amber-800 mt-1">
                  New customer orders will appear here automatically.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrders.map((order) => renderOrderCard(order))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: MESSAGES & INQUIRIES CONTENT */}
        {/* ========================================================= */}
        {activeMainTab === 'messages' && (
          <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2 p-1.5 rounded-2xl honey-glass border border-amber-200 max-w-fit shadow-sm">
                <button
                  onClick={() => setMessageFilter('all')}
                  className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                    messageFilter === 'all'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                      : 'text-amber-900 hover:bg-amber-100/60'
                  }`}
                >
                  All ({messages.length})
                </button>

                <button
                  onClick={() => setMessageFilter('unread')}
                  className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    messageFilter === 'unread'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                      : 'text-amber-900 hover:bg-amber-100/60'
                  }`}
                >
                  <span>⏳ Unread</span>
                  {unreadMessages.length > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                      {unreadMessages.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setMessageFilter('replied')}
                  className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                    messageFilter === 'replied'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                      : 'text-amber-900 hover:bg-amber-100/60'
                  }`}
                >
                  ✅ Replied ({repliedMessages.length})
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-80">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search customer, email, text..."
                  value={messageSearch}
                  onChange={(e) => setMessageSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-2xl honey-glass border border-amber-300 text-xs text-amber-950 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                />
              </div>
            </div>

            {/* Messages Grid */}
            {loadingMessages ? (
              <div className="text-center py-20">
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-amber-950 font-bold text-sm">Loading customer inquiries... 💬</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="honey-glass rounded-3xl p-12 text-center border border-amber-200 shadow-lg max-w-md mx-auto">
                <span className="text-5xl block mb-3 animate-bounce">📬</span>
                <p className="text-xl text-amber-950 font-black font-heading">
                  No messages found
                </p>
                <p className="text-xs text-amber-800 mt-1">
                  Customer messages from the contact page or apiary inquiries will appear here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredMessages.map((msg) => renderMessageCard(msg))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDashboardPage;
