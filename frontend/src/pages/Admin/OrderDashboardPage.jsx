import React, { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderApi } from '../../api/orderApi';
import { messageApi } from '../../api/messageApi';
import { printTaxInvoice } from '../../utils/invoicePrinter';
import { formatDate } from '../../utils/formatters';
import GalleryManagementSection from './components/GalleryManagementSection';
import TeamManagementSection from './components/TeamManagementSection';

const OrderDashboardPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Main Tab: 'orders', 'messages', 'gallery', or 'team'
  const [activeMainTab, setActiveMainTab] = useState(() => {
    const tab = searchParams.get('tab');
    if (['messages', 'gallery', 'team'].includes(tab)) return tab;
    return 'orders';
  });

  // Responsive screen width tracking for dynamic sliding reel items
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cardsPerSlide = windowWidth < 640 ? 1 : windowWidth < 1024 ? 2 : 3;

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [orderFilter, setOrderFilter] = useState('all'); // 'all' | 'pending' | 'completed'
  const [orderPaymentFilter, setOrderPaymentFilter] = useState('all'); // 'all' | 'online' | 'cod'
  const [orderSortBy, setOrderSortBy] = useState('newest'); // 'newest' | 'oldest' | 'amount_desc' | 'amount_asc'
  const [orderSearch, setOrderSearch] = useState('');
  const [orderViewMode, setOrderViewMode] = useState('slider'); // 'slider' | 'grid'
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(false);

  // Messages State
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageFilter, setMessageFilter] = useState(() => searchParams.get('filter') || 'all');
  const [messageSearch, setMessageSearch] = useState('');
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  // React to URL query parameter changes
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const filterParam = searchParams.get('filter');
    if (['messages', 'gallery', 'team', 'orders'].includes(tabParam)) {
      setActiveMainTab(tabParam);
    }
    if (filterParam) setMessageFilter(filterParam);
  }, [searchParams]);

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

  // Parallel initial data loading for lightning-fast access
  useEffect(() => {
    Promise.all([fetchOrders(), fetchMessages()]);
  }, []);

  const markCompleted = async (id) => {
    // Instant optimistic update (0ms UI feedback)
    setOrders((prev) =>
      prev.map((order) => (order._id === id ? { ...order, status: 'Completed' } : order))
    );
    toast.success('✅ Order marked as completed');
    try {
      await orderApi.updateOrderStatus(id, 'Completed');
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error('❌ Failed to sync status with server');
      fetchOrders();
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this order?')) return;
    // Instant optimistic update (0ms UI feedback)
    setOrders((prev) => prev.filter((order) => order._id !== id));
    toast.success('✅ Order deleted successfully');
    try {
      await orderApi.deleteOrder(id);
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('❌ Failed to delete order on server');
      fetchOrders();
    }
  };

  const handleSendReply = async (messageId) => {
    if (!replyText.trim()) {
      toast.error('Please write a reply before sending.');
      return;
    }

    try {
      setIsSendingReply(true);
      await messageApi.replyToMessage(messageId, replyText.trim());
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
      await messageApi.markAsRead(messageId, { target: 'admin' });
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, is_read_by_admin: true, status: m.status === 'unread' ? 'read' : m.status }
            : m
        )
      );
      setUnreadMessagesCount((prev) => Math.max(0, prev - 1));
      window.dispatchEvent(new Event('unreadCountsUpdated'));
      toast.success('Inquiry marked as read ✓');
    } catch (e) {
      console.error('Error marking message as read:', e);
      toast.error('Failed to mark message as read');
    }
  };

  const handleMarkAllMessagesRead = async () => {
    try {
      await messageApi.markAllAsRead({ target: 'admin' });
      setMessages((prev) =>
        prev.map((m) => ({
          ...m,
          is_read_by_admin: true,
          status: m.status === 'unread' ? 'read' : m.status,
        }))
      );
      setUnreadMessagesCount(0);
      window.dispatchEvent(new Event('unreadCountsUpdated'));
      toast.success('All inquiries marked as read ✓');
    } catch (e) {
      console.error('Error marking all as read:', e);
      toast.error('Failed to mark all as read');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to permanently delete this inquiry message?')) return;
    try {
      await messageApi.deleteMessage(messageId);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      setUnreadMessagesCount((prev) => Math.max(0, prev - 1));
      window.dispatchEvent(new Event('unreadCountsUpdated'));
      toast.success('Inquiry deleted successfully');
    } catch (err) {
      console.error('Delete message error:', err);
      toast.error('Failed to delete inquiry');
    }
  };

  // High-performance memoized order filtering, searching, and sorting
  const { pendingOrders, completedOrders, filteredOrders, totalRevenue } = useMemo(() => {
    const pending = orders.filter((order) => order.status !== 'Completed');
    const completed = orders.filter((order) => order.status === 'Completed');
    const revenue = completed.reduce((sum, order) => {
      const price = order.product?.price || 0;
      const qty = order.quantity || 1;
      return sum + price * qty;
    }, 0);

    const result = orders.filter((order) => {
      // 1. Status Filter
      if (orderFilter === 'pending' && order.status === 'Completed') return false;
      if (orderFilter === 'completed' && order.status !== 'Completed') return false;

      // 2. Payment Type Filter
      if (orderPaymentFilter === 'online') {
        const pId = (order.paymentId || '').toLowerCase();
        if (!pId || pId.includes('cash') || pId.includes('cod')) return false;
      } else if (orderPaymentFilter === 'cod') {
        const pId = (order.paymentId || '').toLowerCase();
        if (pId && !pId.includes('cash') && !pId.includes('cod') && pId !== 'verified') return false;
      }

      // 3. Search Filter
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase().trim();
        const invoice = (order.invoiceNumber || '').toLowerCase();
        const name = (order.name || '').toLowerCase();
        const mobile = (order.mobile || '').toLowerCase();
        const email = (order.email || '').toLowerCase();
        const prodName = (order.product?.name || '').toLowerCase();
        const address = (order.address || '').toLowerCase();
        const payment = (order.paymentId || '').toLowerCase();
        const matches =
          name.includes(q) ||
          mobile.includes(q) ||
          email.includes(q) ||
          invoice.includes(q) ||
          prodName.includes(q) ||
          address.includes(q) ||
          payment.includes(q);
        if (!matches) return false;
      }

      return true;
    });

    // 4. Sorting
    result.sort((a, b) => {
      if (orderSortBy === 'oldest') {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }
      if (orderSortBy === 'amount_desc') {
        const totalA = (a.product?.price || 0) * (a.quantity || 1);
        const totalB = (b.product?.price || 0) * (b.quantity || 1);
        return totalB - totalA;
      }
      if (orderSortBy === 'amount_asc') {
        const totalA = (a.product?.price || 0) * (a.quantity || 1);
        const totalB = (b.product?.price || 0) * (b.quantity || 1);
        return totalA - totalB;
      }
      // default: newest first (latest orders)
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

    return {
      pendingOrders: pending,
      completedOrders: completed,
      filteredOrders: result,
      totalRevenue: revenue,
    };
  }, [orders, orderFilter, orderPaymentFilter, orderSortBy, orderSearch]);

  // Chunk filtered orders into pages for the sliding show reel
  const slidePages = useMemo(() => {
    const pages = [];
    for (let i = 0; i < filteredOrders.length; i += cardsPerSlide) {
      pages.push(filteredOrders.slice(i, i + cardsPerSlide));
    }
    return pages.length > 0 ? pages : [[]];
  }, [filteredOrders, cardsPerSlide]);

  const totalSlides = slidePages.length;
  const safeSlideIndex = Math.min(currentSlideIndex, Math.max(0, totalSlides - 1));

  // Reset slide index when filters or search change
  useEffect(() => {
    setCurrentSlideIndex(0);
  }, [orderFilter, orderPaymentFilter, orderSortBy, orderSearch, cardsPerSlide]);

  // Optional auto-play for sliding reel
  useEffect(() => {
    if (!isAutoPlay || orderViewMode !== 'slider' || totalSlides <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlay, orderViewMode, totalSlides]);

  const hasActiveFilters =
    orderFilter !== 'all' ||
    orderPaymentFilter !== 'all' ||
    orderSortBy !== 'newest' ||
    Boolean(orderSearch.trim());

  const resetAllOrderFilters = () => {
    setOrderFilter('all');
    setOrderPaymentFilter('all');
    setOrderSortBy('newest');
    setOrderSearch('');
    setCurrentSlideIndex(0);
  };

  // Filtered Messages: strictly check is_read_by_admin for unread state
  const unreadMessages = useMemo(() => messages.filter((m) => !m.is_read_by_admin), [messages]);
  const repliedMessages = useMemo(() => messages.filter((m) => m.status === 'replied'), [messages]);

  const filteredMessages = useMemo(() => {
    return messages
      .filter((m) => {
        if (messageFilter === 'unread') return !m.is_read_by_admin;
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
  }, [messages, messageFilter, messageSearch]);

  const renderOrderCard = (order) => {
    const formattedInvoice = (order.invoiceNumber || 'INV-TEMP').replace('AJh/2027', 'AJh/2026');
    const orderWithCorrectInvoice = { ...order, invoiceNumber: formattedInvoice };

    return (
      <div
        key={order._id}
        className="honey-glass honey-glass-hover rounded-3xl p-6 border border-amber-200/80 shadow-lg flex flex-col justify-between"
      >
        <div>
          {/* Header */}
          <div className="flex items-start justify-between mb-4 pb-4 border-b border-amber-200/80">
            <div>
              <p className="text-[11px] font-black text-amber-700 uppercase tracking-widest">
                {formattedInvoice}
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
          onClick={() => printTaxInvoice(orderWithCorrectInvoice)}
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
};

  const renderMessageCard = (msg) => {
    const isUnread = !msg.is_read_by_admin;
    const isReplying = replyingId === msg.id;

    return (
      <div
        key={msg.id}
        className={`rounded-3xl p-4 sm:p-6 transition-all duration-300 border shadow-lg flex flex-col justify-between ${
          isUnread
            ? 'bg-amber-50/95 border-amber-400/90 shadow-amber-200/50 ring-2 ring-amber-400/40'
            : 'honey-glass border-amber-200/80'
        }`}
      >
        <div>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-4 pb-3 border-b border-amber-200/70">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-amber-950 font-heading">
                  {msg.name}
                </h3>
                {isUnread && (
                  <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider animate-pulse">
                    New
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-700 font-semibold mt-0.5 break-all">
                {msg.email} {msg.mobile && `• 📱 ${msg.mobile}`}
              </p>
            </div>

            <div className="flex items-center sm:flex-col sm:items-end justify-between gap-1">
              <span
                className={`px-3 py-1 rounded-full text-xs font-black shadow-xs inline-flex items-center gap-1 ${
                  msg.status === 'replied'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-orange-100 text-orange-900 border border-orange-300'
                }`}
              >
                {msg.status === 'replied' ? '✅ Replied' : '⏳ Awaiting Reply'}
              </span>
              <p className="text-[11px] text-gray-500">{formatDate(msg.created_at)}</p>
            </div>
          </div>

          {/* Subject & Message Content */}
          <div className="mb-4">
            <span className="inline-block px-2.5 py-0.5 rounded-lg bg-amber-200/80 text-amber-900 text-[11px] font-extrabold uppercase tracking-wider mb-2">
              🏷️ {msg.subject || 'General Inquiry'}
            </span>
            <div className="bg-white/90 rounded-2xl p-3.5 sm:p-4 border border-amber-100 text-xs sm:text-sm text-amber-950 leading-relaxed font-normal whitespace-pre-wrap break-words">
              {msg.message}
            </div>
          </div>

          {/* Existing Admin Reply Box (If already replied) */}
          {msg.admin_reply && (
            <div className="bg-gradient-to-r from-amber-100/90 to-orange-100/80 border-l-4 border-amber-500 rounded-r-2xl p-3.5 sm:p-4 mb-4 text-xs text-amber-950">
              <div className="flex items-center justify-between font-bold text-amber-900 uppercase tracking-wider text-[10px] mb-1">
                <span>🍯 Official Team Reply</span>
                {msg.replied_at && <span>{formatDate(msg.replied_at)}</span>}
              </div>
              <p className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm font-medium break-words">
                {msg.admin_reply}
              </p>
            </div>
          )}

          {/* Inline Reply Composer */}
          {isReplying && (
            <div className="mt-4 p-4 rounded-2xl bg-white border-2 border-amber-400 shadow-md space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-1">
                  <span>✉️</span> Reply to {msg.name}
                </span>
                <span className="text-[11px] text-gray-500 break-all">Emailed to: {msg.email}</span>
              </div>
              <textarea
                rows={3}
                className="w-full p-3 text-xs sm:text-sm rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-amber-950 resize-y"
                placeholder={`Type your response to ${msg.name}... (This reply will be emailed and displayed in their website account)`}
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
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-amber-200/70 mt-2">
          <div className="flex items-center gap-2">
            {isUnread ? (
              <button
                onClick={() => handleMarkMessageRead(msg.id)}
                className="px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl transition-all shadow-xs flex items-center gap-1"
              >
                <span>✓</span> Mark Read
              </button>
            ) : (
              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                <span>✓</span> Read
              </span>
            )}

            <button
              onClick={() => handleDeleteMessage(msg.id)}
              className="px-3 py-1.5 text-xs font-bold text-red-700 bg-red-100 hover:bg-red-200 border border-red-300 rounded-xl transition-all shadow-xs flex items-center gap-1"
              title="Delete Inquiry Permanently"
            >
              <span>🗑️</span>
              <span>Delete</span>
            </button>
          </div>

          {!isReplying && (
            <button
              onClick={() => {
                setReplyingId(msg.id);
                setReplyText(msg.admin_reply ? `Dear ${msg.name},\n\n` : `Dear ${msg.name},\n\nThank you for reaching out to Aai Ji Honey.\n\n`);
              }}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5 ml-auto"
            >
              <span>✉️</span> {msg.admin_reply ? 'Update Reply' : 'Reply & Email'}
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

        {/* Main Section Switcher Tabs: Orders vs Messages vs Gallery vs Team */}
        <div className="flex items-center gap-2 sm:gap-3 border-b-2 border-amber-200/80 pb-2 overflow-x-auto no-scrollbar scroll-smooth flex-nowrap sm:flex-wrap">
          <button
            onClick={() => {
              setActiveMainTab('orders');
              setSearchParams({});
            }}
            className={`pb-2 px-3.5 sm:px-5 font-black text-xs sm:text-sm uppercase tracking-wider transition-all relative flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ${
              activeMainTab === 'orders'
                ? 'text-amber-950 border-b-4 border-amber-500 -mb-[10px]'
                : 'text-amber-800/70 hover:text-amber-950'
            }`}
          >
            <span>📦 Orders</span>
            <span className="bg-amber-100 text-amber-900 text-xs px-2 py-0.5 rounded-full font-black border border-amber-300">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveMainTab('messages');
              setSearchParams({ tab: 'messages' });
            }}
            className={`pb-2 px-3.5 sm:px-5 font-black text-xs sm:text-sm uppercase tracking-wider transition-all relative flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ${
              activeMainTab === 'messages'
                ? 'text-amber-950 border-b-4 border-amber-500 -mb-[10px]'
                : 'text-amber-800/70 hover:text-amber-950'
            }`}
          >
            <span>💬 Inquiries & Messages</span>
            {unreadMessages.length > 0 && (
              <span className="bg-red-500 text-white text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 rounded-full font-black shadow-sm animate-pulse flex items-center gap-1">
                <span>🔴</span>
                <span>{unreadMessages.length} unread</span>
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveMainTab('gallery');
              setSearchParams({ tab: 'gallery' });
            }}
            className={`pb-2 px-3.5 sm:px-5 font-black text-xs sm:text-sm uppercase tracking-wider transition-all relative flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ${
              activeMainTab === 'gallery'
                ? 'text-amber-950 border-b-4 border-amber-500 -mb-[10px]'
                : 'text-amber-800/70 hover:text-amber-950'
            }`}
          >
            <span>📸 Apiary Gallery</span>
          </button>

          <button
            onClick={() => {
              setActiveMainTab('team');
              setSearchParams({ tab: 'team' });
            }}
            className={`pb-2 px-3.5 sm:px-5 font-black text-xs sm:text-sm uppercase tracking-wider transition-all relative flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ${
              activeMainTab === 'team'
                ? 'text-amber-950 border-b-4 border-amber-500 -mb-[10px]'
                : 'text-amber-800/70 hover:text-amber-950'
            }`}
          >
            <span>👥 Scientists & Team</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: ORDERS CONTENT */}
        {/* ========================================================= */}
        {activeMainTab === 'orders' && (
          <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="honey-glass rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-sm">
                <span className="text-[11px] sm:text-xs font-bold text-amber-800 uppercase tracking-wider block">
                  Total Orders
                </span>
                <p className="text-2xl sm:text-3xl font-black text-amber-950 mt-1 font-heading truncate">
                  {orders.length}
                </p>
              </div>

              <div className="honey-glass rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-sm">
                <span className="text-[11px] sm:text-xs font-bold text-orange-700 uppercase tracking-wider block">
                  Pending Orders
                </span>
                <p className="text-2xl sm:text-3xl font-black text-orange-600 mt-1 font-heading truncate">
                  {pendingOrders.length}
                </p>
              </div>

              <div className="honey-glass rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-sm">
                <span className="text-[11px] sm:text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                  Completed Orders
                </span>
                <p className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1 font-heading truncate">
                  {completedOrders.length}
                </p>
              </div>

              <div className="honey-glass rounded-2xl p-4 sm:p-5 border border-amber-200 shadow-sm">
                <span className="text-[11px] sm:text-xs font-bold text-amber-900 uppercase tracking-wider block">
                  Total Revenue
                </span>
                <p className="text-2xl sm:text-3xl font-black text-amber-950 mt-1 font-heading truncate">
                  ₹{totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Filter and Search Bar Section */}
            <div className="honey-glass rounded-3xl p-4 sm:p-5 border border-amber-200 shadow-sm space-y-4">
              {/* Top Controls: Search Bar & View Mode */}
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-amber-700">🔍</span>
                  <input
                    type="text"
                    placeholder="Search by customer name, mobile, email, invoice #, jar type, or address..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm rounded-2xl bg-white/95 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold text-amber-950 placeholder-amber-700/50 shadow-inner"
                  />
                  {orderSearch && (
                    <button
                      onClick={() => setOrderSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-amber-700 hover:text-amber-950 font-bold bg-amber-100 hover:bg-amber-200 rounded-full w-5 h-5 flex items-center justify-center transition"
                      title="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* View Mode Switcher */}
                <div className="flex items-center p-1 rounded-2xl bg-amber-100/90 border border-amber-300 shadow-sm flex-shrink-0 self-start md:self-auto">
                  <button
                    onClick={() => setOrderViewMode('slider')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                      orderViewMode === 'slider'
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-xs'
                        : 'text-amber-900 hover:bg-amber-200/60'
                    }`}
                    title="Sliding show reel (keeps main frame height steady)"
                  >
                    <span>🎞️</span>
                    <span>Slider Reel</span>
                  </button>
                  <button
                    onClick={() => setOrderViewMode('grid')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                      orderViewMode === 'grid'
                        ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-xs'
                        : 'text-amber-900 hover:bg-amber-200/60'
                    }`}
                    title="Grid view (view all orders)"
                  >
                    <span>▦</span>
                    <span>Grid View</span>
                  </button>
                </div>
              </div>

              {/* Bottom Controls: Filter Pills, Payment Type, Sort, and Reset */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-amber-200/70">
                {/* Status Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => setOrderFilter('all')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                      orderFilter === 'all'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-white/80 text-amber-900 hover:bg-amber-100/80 border border-amber-200'
                    }`}
                  >
                    All ({orders.length})
                  </button>

                  <button
                    onClick={() => setOrderFilter('pending')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                      orderFilter === 'pending'
                        ? 'bg-orange-600 text-white shadow-xs'
                        : 'bg-white/80 text-amber-900 hover:bg-amber-100/80 border border-amber-200'
                    }`}
                  >
                    ⏳ Pending ({pendingOrders.length})
                  </button>

                  <button
                    onClick={() => setOrderFilter('completed')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                      orderFilter === 'completed'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white/80 text-amber-900 hover:bg-amber-100/80 border border-amber-200'
                    }`}
                  >
                    ✅ Completed ({completedOrders.length})
                  </button>
                </div>

                {/* Dropdown Filters: Payment & Sorting */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Payment Filter Dropdown */}
                  <select
                    value={orderPaymentFilter}
                    onChange={(e) => setOrderPaymentFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-950 bg-white/90 border border-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-xs cursor-pointer"
                  >
                    <option value="all">💳 All Payments</option>
                    <option value="online">⚡ Online / Prepaid (Razorpay)</option>
                    <option value="cod">💵 Cash on Delivery / Offline</option>
                  </select>

                  {/* Sort Dropdown */}
                  <select
                    value={orderSortBy}
                    onChange={(e) => setOrderSortBy(e.target.value)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-950 bg-white/90 border border-amber-300 focus:outline-none focus:ring-1 focus:ring-amber-500 shadow-xs cursor-pointer"
                  >
                    <option value="newest">🕒 Latest Orders First</option>
                    <option value="oldest">⏳ Oldest Orders First</option>
                    <option value="amount_desc">💰 Billed: High to Low</option>
                    <option value="amount_asc">🪙 Billed: Low to High</option>
                  </select>

                  {/* Clear Filters Button */}
                  {hasActiveFilters && (
                    <button
                      onClick={resetAllOrderFilters}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-all flex items-center gap-1 shadow-xs"
                      title="Reset all filters"
                    >
                      <span>✕</span>
                      <span>Reset Filters</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Slider Navigation Bar (when in slider view) */}
            {orderViewMode === 'slider' && filteredOrders.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-2 py-1 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-black text-amber-950 uppercase tracking-wider text-[11px] flex items-center gap-1">
                    <span>✨ Latest Orders Reel</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 font-bold text-amber-900 text-[10px]">
                    Slide {safeSlideIndex + 1} of {totalSlides} • Showing {Math.min(safeSlideIndex * cardsPerSlide + 1, filteredOrders.length)}–{Math.min((safeSlideIndex + 1) * cardsPerSlide, filteredOrders.length)} of {filteredOrders.length}
                  </span>
                  {hasActiveFilters && (
                    <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-200 font-bold text-[10px]">
                      Filtered
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  {/* Auto-Slide Toggle Button */}
                  {totalSlides > 1 && (
                    <button
                      onClick={() => setIsAutoPlay(!isAutoPlay)}
                      className={`px-2.5 py-1.5 rounded-xl font-bold text-[11px] uppercase tracking-wider transition-all flex items-center gap-1 border shadow-xs ${
                        isAutoPlay
                          ? 'bg-amber-600 text-white border-amber-700'
                          : 'bg-white/80 text-amber-900 border-amber-300 hover:bg-amber-100'
                      }`}
                      title={isAutoPlay ? 'Pause auto-slide' : 'Play auto-slide reel'}
                    >
                      <span>{isAutoPlay ? '⏸ Pause' : '▶ Auto Reel'}</span>
                    </button>
                  )}

                  {totalSlides > 1 && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
                        disabled={safeSlideIndex === 0}
                        className="px-3 py-1.5 rounded-xl honey-glass border border-amber-300 font-bold text-xs text-amber-950 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-100 transition shadow-xs flex items-center gap-1"
                        title="Previous slide"
                      >
                        <span>❮</span>
                        <span className="hidden sm:inline">Prev</span>
                      </button>

                      {/* Pagination Dots */}
                      <div className="flex items-center gap-1.5 px-1.5">
                        {Array.from({ length: totalSlides }).map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentSlideIndex(idx)}
                            className={`h-2.5 rounded-full transition-all duration-300 ${
                              safeSlideIndex === idx
                                ? 'bg-amber-600 w-5'
                                : 'bg-amber-300 hover:bg-amber-400 w-2.5'
                            }`}
                            title={`Jump to slide ${idx + 1}`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={() => setCurrentSlideIndex((prev) => Math.min(totalSlides - 1, prev + 1))}
                        disabled={safeSlideIndex >= totalSlides - 1}
                        className="px-3 py-1.5 rounded-xl honey-glass border border-amber-300 font-bold text-xs text-amber-950 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-amber-100 transition shadow-xs flex items-center gap-1"
                        title="Next slide"
                      >
                        <span className="hidden sm:inline">Next</span>
                        <span>❯</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Orders Display Area (Steady Frame) */}
            {loadingOrders ? (
              <div className="text-center py-20 min-h-[400px] flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-amber-950 font-bold text-sm">Gathering orders from database... 🍯</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="honey-glass rounded-3xl p-12 text-center border border-amber-200 shadow-lg max-w-md mx-auto min-h-[360px] flex flex-col items-center justify-center">
                <span className="text-5xl block mb-3 animate-bounce">📦</span>
                <p className="text-xl text-amber-950 font-black font-heading">
                  {hasActiveFilters ? 'No matching orders found' : 'No orders in this category'}
                </p>
                <p className="text-xs text-amber-800 mt-1 max-w-sm">
                  {hasActiveFilters
                    ? 'No orders matched your active search criteria or filters. Try adjusting your query or resetting filters.'
                    : 'New customer orders will appear here automatically.'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={resetAllOrderFilters}
                    className="mt-4 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow transition flex items-center gap-1.5"
                  >
                    <span>↺</span>
                    <span>Reset All Filters</span>
                  </button>
                )}
              </div>
            ) : orderViewMode === 'slider' ? (
              /* Sliding Show Reel Track with Steady Container Frame */
              <div className="relative overflow-hidden w-full rounded-3xl min-h-[560px]">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${safeSlideIndex * 100}%)` }}
                >
                  {slidePages.map((pageOrders, pageIdx) => (
                    <div
                      key={pageIdx}
                      className="w-full flex-shrink-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
                    >
                      {pageOrders.map((order) => renderOrderCard(order))}
                      {/* Invisible place-holders on the last slide to guarantee steady grid spacing and container height */}
                      {Array.from({ length: Math.max(0, cardsPerSlide - pageOrders.length) }).map((_, dummyIdx) => (
                        <div
                          key={`dummy-${pageIdx}-${dummyIdx}`}
                          className="invisible pointer-events-none hidden sm:block"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Grid View: all orders displayed */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300">
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
              <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl honey-glass border border-amber-200 shadow-sm w-full md:w-auto">
                <button
                  onClick={() => {
                    setMessageFilter('all');
                    setSearchParams({ tab: 'messages', filter: 'all' });
                  }}
                  className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-center ${
                    messageFilter === 'all'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                      : 'text-amber-900 hover:bg-amber-100/60'
                  }`}
                >
                  All ({messages.length})
                </button>

                <button
                  onClick={() => {
                    setMessageFilter('unread');
                    setSearchParams({ tab: 'messages', filter: 'unread' });
                  }}
                  className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                    messageFilter === 'unread'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                      : 'text-amber-900 hover:bg-amber-100/60'
                  }`}
                >
                  <span>🔴 Unread</span>
                  {unreadMessages.length > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                      {unreadMessages.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setMessageFilter('replied');
                    setSearchParams({ tab: 'messages', filter: 'replied' });
                  }}
                  className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-center ${
                    messageFilter === 'replied'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                      : 'text-amber-900 hover:bg-amber-100/60'
                  }`}
                >
                  ✅ Replied ({repliedMessages.length})
                </button>

                {unreadMessages.length > 0 && (
                  <button
                    onClick={handleMarkAllMessagesRead}
                    className="w-full sm:w-auto px-3 py-2 rounded-xl font-bold text-xs bg-amber-200/80 hover:bg-amber-300 text-amber-950 transition-all flex items-center justify-center gap-1 shadow-xs"
                    title="Mark all pending inquiries as read"
                  >
                    <span>✓✓</span>
                    <span>Mark All Read</span>
                  </button>
                )}
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

        {/* ========================================================= */}
        {/* TAB 3: GALLERY CONTENT */}
        {/* ========================================================= */}
        {activeMainTab === 'gallery' && <GalleryManagementSection />}

        {/* ========================================================= */}
        {/* TAB 4: TEAM CONTENT */}
        {/* ========================================================= */}
        {activeMainTab === 'team' && <TeamManagementSection />}
      </div>
    </div>
  );
};

export default OrderDashboardPage;
