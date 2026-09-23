import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import { customerAuthApi } from '../../api/customerAuthApi';
import { orderApi } from '../../api/orderApi';
import { messageApi } from '../../api/messageApi';
import AddressInputFields from '../../components/common/AddressInputFields';
import { formatDeliveryAddress, parseDeliveryAddress } from '../../utils/addressFormatter';
import RatingModal from '../../components/common/RatingModal';

// Status tracking milestones in sequence
const TRACKING_STEPS = [
  { key: 'Pending', label: 'Order Placed', icon: '⏳', description: 'Your order has been recorded' },
  { key: 'Confirmed', label: 'Confirmed', icon: '🍯', description: 'Harvest & packaging confirmed' },
  { key: 'Shipped', label: 'Shipped', icon: '🚚', description: 'Dispatched via courier' },
  { key: 'Out for Delivery', label: 'Out for Delivery', icon: '🛵', description: 'Courier out for delivery' },
  { key: 'Delivered', label: 'Delivered', icon: '🎉', description: 'Safely delivered to your door' },
];

const INQUIRY_TOPICS = [
  'General Inquiry & Raw Honey Questions',
  'Order Tracking & Delivery Status',
  'Bulk Honey & Corporate Gifting',
  'Desert Apiary Visit & Bee Observation',
  'Quality, Harvest & Lab Testing Certification',
  'Feedback & Custom Honey Requirements',
];

const getStepIndex = (status) => {
  const norm = (status || '').toLowerCase().trim();
  if (norm.includes('deliver')) return 4;
  if (norm.includes('out')) return 3;
  if (norm.includes('ship') || norm.includes('dispatch')) return 2;
  if (norm.includes('confirm') || norm.includes('process')) return 1;
  return 0; // Default Pending
};

const getStatusBadge = (status) => {
  const norm = (status || '').toLowerCase().trim();
  if (norm.includes('deliver')) {
    return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  }
  if (norm.includes('out')) {
    return 'bg-purple-100 text-purple-800 border-purple-300';
  }
  if (norm.includes('ship')) {
    return 'bg-blue-100 text-blue-800 border-blue-300';
  }
  if (norm.includes('confirm')) {
    return 'bg-amber-100 text-amber-800 border-amber-300';
  }
  return 'bg-yellow-100 text-yellow-800 border-yellow-300';
};

const UserProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active view tab: 'orders' | 'messages'
  const [activeTab, setActiveTab] = useState(() =>
    searchParams.get('tab') === 'messages' ? 'messages' : 'orders'
  );
  const [messageFilter, setMessageFilter] = useState(() =>
    searchParams.get('filter') || 'all'
  );

  // React to URL query parameter changes
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const filterParam = searchParams.get('filter');
    if (tabParam === 'messages') setActiveTab('messages');
    else if (tabParam === 'orders') setActiveTab('orders');
    if (filterParam) setMessageFilter(filterParam);
  }, [searchParams]);

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
    location: user?.location || '',
    address: user?.address || '',
  });
  const [addressFields, setAddressFields] = useState(() =>
    parseDeliveryAddress(user?.address || '')
  );

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [ratingModalProduct, setRatingModalProduct] = useState(null);

  // Messages State
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [userUnreadCount, setUserUnreadCount] = useState(0);
  const [showCompose, setShowCompose] = useState(false);
  const [composeTopic, setComposeTopic] = useState(INQUIRY_TOPICS[0]);
  const [composeText, setComposeText] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Sync profileForm if user context changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        mobile: user.mobile || '',
        location: user.location || '',
        address: user.address || '',
      });
      setAddressFields(parseDeliveryAddress(user.address || ''));
    }
  }, [user]);

  // Fetch customer orders
  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const data = await orderApi.getMyOrders();
      setOrders(data?.orders || []);
      setOrdersError(null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrdersError('Unable to load your orders right now. Please try again.');
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch customer messages
  const fetchMessages = async () => {
    try {
      setLoadingMessages(true);
      const data = await messageApi.getMyMessages();
      setMessages(data?.messages || []);
      setUserUnreadCount(data?.unreadCount || 0);
      setMessagesError(null);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setMessagesError('Unable to load your messages right now.');
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchMessages();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.name.trim()) {
      toast.error('Name is required.');
      return;
    }

    if (profileForm.mobile && !/^[0-9]{10}$/.test(profileForm.mobile.trim())) {
      toast.error('Mobile number must be a valid 10-digit number.');
      return;
    }

    try {
      setIsSaving(true);
      const formattedAddress = formatDeliveryAddress(addressFields);
      const derivedLocation = addressFields.city
        ? `${addressFields.city}, ${addressFields.state}`
        : profileForm.location;

      const res = await customerAuthApi.updateProfile({
        name: profileForm.name.trim(),
        mobile: profileForm.mobile ? profileForm.mobile.trim() : '',
        location: derivedLocation || '',
        address: formattedAddress,
      });

      updateUser(res.user);
      toast.success('✅ Profile & saved address updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!composeText.trim()) {
      toast.error('Please enter your inquiry or message.');
      return;
    }

    try {
      setIsSendingMessage(true);
      const res = await messageApi.sendMessage({
        name: user?.name || 'Valued Customer',
        email: user?.email,
        mobile: user?.mobile || '',
        subject: composeTopic,
        message: composeText.trim(),
      });

      toast.success(res.message || '🎉 Inquiry submitted to the Apiary Team!');
      setComposeText('');
      setShowCompose(false);
      await fetchMessages();
      window.dispatchEvent(new Event('unreadCountsUpdated'));
    } catch (err) {
      console.error('Failed to send message:', err);
      toast.error(err.response?.data?.error || 'Failed to send inquiry. Please try again.');
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleMarkAsRead = async (msgId) => {
    try {
      await messageApi.markAsRead(msgId, { target: 'user' });
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, is_read_by_user: true } : m))
      );
      setUserUnreadCount((prev) => Math.max(0, prev - 1));
      window.dispatchEvent(new Event('unreadCountsUpdated'));
      toast.success('Reply marked as read ✓');
    } catch (err) {
      console.error('Error marking message as read:', err);
      toast.error('Failed to mark reply as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await messageApi.markAllAsRead({ target: 'user' });
      setMessages((prev) =>
        prev.map((m) => ({ ...m, is_read_by_user: true }))
      );
      setUserUnreadCount(0);
      window.dispatchEvent(new Event('unreadCountsUpdated'));
      toast.success('All replies marked as read ✓');
    } catch (err) {
      console.error('Error marking all as read:', err);
      toast.error('Failed to mark all as read');
    }
  };

  const unreadReplies = messages.filter((m) => !m.is_read_by_user && m.admin_reply);
  const repliedInquiries = messages.filter((m) => m.status === 'replied' || m.admin_reply);

  const filteredUserMessages = messages.filter((m) => {
    if (messageFilter === 'unread') return !m.is_read_by_user && m.admin_reply;
    if (messageFilter === 'replied') return m.status === 'replied' || m.admin_reply;
    return true;
  });

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="w-full min-h-[90vh] relative pb-20 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Title */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 rounded-full border border-amber-300 text-amber-900 font-bold text-xs uppercase tracking-wider">
            <span>📦</span> Customer Portal
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-amber-950 font-heading">
            My Account & Apiary Portal
          </h1>
          <p className="text-xs sm:text-sm text-amber-900/80 font-medium">
            Manage your personal delivery details, track your pure Rajasthan honey shipments, and communicate directly with our apiary team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ========================================================= */}
          {/* LEFT COLUMN: Profile & Saved Delivery Address */}
          {/* ========================================================= */}
          <div className="lg:col-span-1">
            <div className="honey-glass rounded-3xl shadow-xl border border-amber-200/80 p-6 sticky top-24">
              {/* Profile Header Avatar */}
              <div className="text-center pb-6 border-b border-amber-200/80">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-black text-3xl flex items-center justify-center mx-auto shadow-lg ring-4 ring-amber-300">
                  {userInitial}
                </div>
                <h2 className="text-xl font-bold text-amber-950 mt-3">{user?.name || 'Customer'}</h2>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 border border-green-200 rounded-full mt-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-xs font-semibold text-green-700">Verified Customer</span>
                </div>
              </div>

              {/* View / Edit Mode */}
              {!isEditing ? (
                <div className="mt-6 space-y-4 text-sm">
                  <div>
                    <span className="text-xs text-gray-500 block">✉️ Email Address</span>
                    <p className="font-semibold text-amber-950 break-all">{user?.email || '—'}</p>
                  </div>

                  <div>
                    <span className="text-xs text-gray-500 block">📱 Mobile Number</span>
                    <p className="font-semibold text-amber-950">{user?.mobile || 'Not provided yet'}</p>
                  </div>

                  <div>
                    <span className="text-xs text-gray-500 block">📍 City / Location</span>
                    <p className="font-semibold text-amber-950">{user?.location || 'Not specified'}</p>
                  </div>

                  <div>
                    <span className="text-xs text-gray-500 block">🏠 Default Delivery Address</span>
                    <p className="font-medium text-amber-950 bg-amber-50/70 p-3 rounded-xl border border-amber-200 mt-1 whitespace-pre-wrap">
                      {user?.address || 'No saved address yet. Add your delivery address so it automatically fills during checkout!'}
                    </p>
                  </div>

                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full mt-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
                  >
                    <span>✏️</span> Edit Profile & Address
                  </button>
                </div>
              ) : (
                /* Inline Edit Form */
                <form onSubmit={handleSaveProfile} className="mt-5 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-amber-900 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) =>
                        setProfileForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm bg-amber-50/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-900 mb-1">Mobile Number (10 digits)</label>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="9876543210"
                      value={profileForm.mobile}
                      onChange={(e) =>
                        setProfileForm((prev) => ({
                          ...prev,
                          mobile: e.target.value.replace(/\D/g, ''),
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none text-sm bg-amber-50/40"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-900 mb-1.5">
                      🏠 Default Delivery Address (House, Street, Area, City, State, PIN, Country)
                    </label>
                    <AddressInputFields
                      values={addressFields}
                      onChange={setAddressFields}
                      required={false}
                      showPreview={true}
                      compact={true}
                    />
                    <p className="text-[11px] text-amber-700 mt-1.5">
                      💡 This combined address will be automatically filled in during your orders.
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="flex-1 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow text-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      {isSaving ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        '💾 Save'
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Orders & Messages Tabs */}
          {/* ========================================================= */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top Navigation Tabs */}
            <div className="flex flex-col sm:flex-row items-center gap-2 p-1.5 bg-amber-100/70 backdrop-blur-md rounded-2xl border border-amber-300/80 shadow-sm">
              <button
                onClick={() => {
                  setActiveTab('orders');
                  setSearchParams({});
                }}
                className={`w-full sm:flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-extrabold text-xs sm:text-base transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'orders'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20'
                    : 'text-amber-900 hover:bg-amber-200/50'
                }`}
              >
                <span>📦</span>
                <span>My Orders ({orders.length})</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('messages');
                  setSearchParams({ tab: 'messages' });
                }}
                className={`w-full sm:flex-1 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-extrabold text-xs sm:text-base transition-all flex items-center justify-center gap-2 relative ${
                  activeTab === 'messages'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20'
                    : 'text-amber-900 hover:bg-amber-200/50'
                }`}
              >
                <span>💬</span>
                <span>Inquiries & Messages</span>
                {userUnreadCount > 0 ? (
                  <span className="bg-red-500 text-white text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full shadow-sm animate-pulse flex items-center gap-1">
                    <span>✨</span> {userUnreadCount} New
                  </span>
                ) : (
                  <span className="text-xs opacity-75 font-semibold">({messages.length})</span>
                )}
              </button>
            </div>

            {/* ===================================================== */}
            {/* TAB 1: MY ORDERS & TRACKING */}
            {/* ===================================================== */}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-extrabold text-amber-950 flex items-center gap-2">
                    <span>📦</span> My Orders & Live Tracking ({orders.length})
                  </h2>
                  <button
                    onClick={fetchOrders}
                    className="text-xs text-amber-700 hover:text-amber-950 font-bold px-3 py-1.5 bg-amber-100 hover:bg-amber-200 rounded-full transition-colors flex items-center gap-1"
                  >
                    <span>🔄</span> Refresh
                  </button>
                </div>

                {/* Loading State */}
                {loadingOrders && (
                  <div className="bg-white/80 rounded-3xl p-12 text-center border border-amber-200 shadow-sm flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-amber-900 font-semibold">Loading your order history...</p>
                  </div>
                )}

                {/* Error State */}
                {!loadingOrders && ordersError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
                    <p className="font-semibold">{ordersError}</p>
                    <button
                      onClick={fetchOrders}
                      className="mt-3 px-5 py-2 bg-amber-600 text-white rounded-full font-bold text-sm hover:bg-amber-700 transition-colors"
                    >
                      Retry Loading
                    </button>
                  </div>
                )}

                {/* Empty State */}
                {!loadingOrders && !ordersError && orders.length === 0 && (
                  <div className="bg-white/90 backdrop-blur-md rounded-3xl p-12 text-center border border-amber-200 shadow-lg max-w-md mx-auto">
                    <span className="text-6xl block mb-3">🍯</span>
                    <h3 className="text-xl font-bold text-amber-950">No orders placed yet</h3>
                    <p className="text-gray-600 text-sm mt-2 mb-6">
                      You haven't ordered any honey yet. Direct from Rajasthan's natural hives to your doorstep!
                    </p>
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm no-underline"
                    >
                      <span>🛍️</span> Explore Pure Honey Store
                    </Link>
                  </div>
                )}

                {/* Order Cards List with Tracking Progress */}
                {!loadingOrders && !ordersError && orders.length > 0 && (
                  <div className="space-y-6">
                    {orders.map((order) => {
                      const currentStepIdx = getStepIndex(order.status);
                      const orderDate = order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : 'Recent';

                      return (
                        <div
                          key={order._id}
                          className="bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border border-amber-200 overflow-hidden hover:shadow-2xl transition-all"
                        >
                          {/* Order Card Header */}
                          <div className="bg-gradient-to-r from-amber-500/10 via-amber-100/50 to-orange-50/50 px-6 py-4 border-b border-amber-200 flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                                  Invoice:
                                </span>
                                <span className="font-mono font-bold text-amber-950 text-sm">
                                  {order.invoiceNumber || 'AJh/Pending'}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500">Ordered on: {orderDate}</span>
                            </div>

                            <div className="flex items-center gap-2.5">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-extrabold border shadow-sm ${getStatusBadge(
                                  order.status
                                )}`}
                              >
                                {order.status || 'Pending'}
                              </span>
                            </div>
                          </div>

                          {/* Visual Milestone Tracking Timeline */}
                          <div className="px-6 py-6 border-b border-amber-100 bg-amber-50/30">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 mb-4 flex items-center gap-1.5">
                              <span>📍</span> Live Delivery Tracker
                            </h4>

                            {/* Tracker Progress Bar */}
                            <div className="relative">
                              {/* Background Track Line */}
                              <div className="absolute top-5 left-4 right-4 h-1.5 bg-gray-200 rounded-full -z-0">
                                {/* Filled Progress Line */}
                                <div
                                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-700"
                                  style={{
                                    width: `${(currentStepIdx / (TRACKING_STEPS.length - 1)) * 100}%`,
                                  }}
                                ></div>
                              </div>

                              {/* Step Nodes */}
                              <div className="relative flex justify-between z-10">
                                {TRACKING_STEPS.map((step, idx) => {
                                  const isCompleted = idx < currentStepIdx;
                                  const isCurrent = idx === currentStepIdx;

                                  return (
                                    <div key={step.key} className="flex flex-col items-center text-center max-w-[80px]">
                                      {/* Node Circle */}
                                      <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold shadow-md transition-all ${
                                          isCurrent
                                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white ring-4 ring-amber-200 scale-110 animate-pulse'
                                            : isCompleted
                                            ? 'bg-amber-600 text-white'
                                            : 'bg-white text-gray-400 border-2 border-gray-300'
                                        }`}
                                      >
                                        {isCompleted ? '✓' : step.icon}
                                      </div>

                                      {/* Step Label */}
                                      <span
                                        className={`text-[11px] font-bold mt-2 leading-tight ${
                                          isCurrent
                                            ? 'text-amber-900'
                                            : isCompleted
                                            ? 'text-amber-700'
                                            : 'text-gray-400'
                                        }`}
                                      >
                                        {step.label}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Order Details Body */}
                          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Product Info */}
                            <div className="flex gap-4 items-center">
                              <div className="w-20 h-20 bg-amber-50 rounded-2xl border border-amber-200 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                <img
                                  src={order.product?.image || '/favicon.ico'}
                                  alt={order.product?.name || 'Honey'}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                              <div>
                                <h4 className="font-bold text-amber-950 text-base">
                                  {order.product?.name || 'Pure Rajasthan Honey'}
                                </h4>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  Quantity: <strong className="text-amber-900">{order.quantity} Jar(s)</strong>
                                </p>
                                <p className="text-lg font-extrabold text-amber-700 mt-1">
                                  ₹{order.product?.totalprice || order.product?.price || '—'}
                                </p>
                                <button
                                  onClick={() =>
                                    setRatingModalProduct({
                                      id: order.product?.id || order.product?._id,
                                      name: order.product?.name,
                                      image: order.product?.image,
                                    })
                                  }
                                  className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 font-bold text-xs shadow-xs transition-all hover:scale-105"
                                >
                                  <span>⭐</span>
                                  <span>Rate This Honey</span>
                                </button>
                              </div>
                            </div>

                            {/* Delivery & Payment Details */}
                            <div className="text-xs space-y-2 bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                              <div>
                                <span className="text-gray-500 font-semibold block">📍 Delivery To:</span>
                                <span className="text-amber-950 font-bold">{order.name} ({order.mobile})</span>
                                <p className="text-gray-700 mt-0.5 leading-relaxed">{order.address}</p>
                              </div>
                              {order.paymentId && (
                                <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between">
                                  <span className="text-gray-500">Payment ID:</span>
                                  <span className="font-mono text-gray-700 font-semibold">{order.paymentId}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ===================================================== */}
            {/* TAB 2: MY INQUIRIES & MESSAGES */}
            {/* ===================================================== */}
            {activeTab === 'messages' && (
              <div className="space-y-6">
                {/* Header with Compose Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-amber-950 flex items-center gap-2">
                      <span>💬</span> Direct Apiary Messages & Inquiries
                    </h2>
                    <p className="text-xs text-amber-800/80 mt-1">
                      Direct dialogue with Dr. Sitaram Seervi & our desert apiculture team. Replies are sent here and to your email.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      onClick={() => setShowCompose((prev) => !prev)}
                      className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-full text-xs shadow-md transition-all flex items-center gap-1.5"
                    >
                      <span>{showCompose ? '✕ Close' : '✍️ New Message'}</span>
                    </button>
                    <button
                      onClick={fetchMessages}
                      className="text-xs text-amber-700 hover:text-amber-950 font-bold px-3 py-2 bg-amber-100 hover:bg-amber-200 rounded-full transition-colors flex items-center gap-1"
                      title="Refresh Messages"
                    >
                      <span>🔄</span>
                    </button>
                  </div>
                </div>

                {/* Filter Pills & Quick Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-1.5 bg-amber-50/80 rounded-2xl border border-amber-200 shadow-xs">
                  <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        setMessageFilter('all');
                        setSearchParams({ tab: 'messages', filter: 'all' });
                      }}
                      className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl font-bold text-xs transition-all text-center ${
                        messageFilter === 'all'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs'
                          : 'text-amber-900 hover:bg-amber-100'
                      }`}
                    >
                      All ({messages.length})
                    </button>
                    <button
                      onClick={() => {
                        setMessageFilter('unread');
                        setSearchParams({ tab: 'messages', filter: 'unread' });
                      }}
                      className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1 text-center ${
                        messageFilter === 'unread'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs'
                          : 'text-amber-900 hover:bg-amber-100'
                      }`}
                    >
                      <span>✨ Unread Replies</span>
                      {userUnreadCount > 0 && (
                        <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                          {userUnreadCount}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setMessageFilter('replied');
                        setSearchParams({ tab: 'messages', filter: 'replied' });
                      }}
                      className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl font-bold text-xs transition-all text-center ${
                        messageFilter === 'replied'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-xs'
                          : 'text-amber-900 hover:bg-amber-100'
                      }`}
                    >
                      ✅ Replied ({repliedInquiries.length})
                    </button>
                  </div>

                  {userUnreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="w-full sm:w-auto px-3.5 py-1.5 rounded-xl font-bold text-xs bg-amber-200/80 hover:bg-amber-300 text-amber-950 transition-all flex items-center justify-center gap-1 shadow-xs ml-auto"
                      title="Mark all replies as read"
                    >
                      <span>✓✓</span>
                      <span>Mark All Read</span>
                    </button>
                  )}
                </div>

                {/* Inline Message Compose Drawer */}
                {showCompose && (
                  <div className="bg-gradient-to-br from-amber-50 via-white to-orange-50 rounded-3xl p-4 sm:p-6 border-2 border-amber-300 shadow-xl animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-3 mb-4 border-b border-amber-200">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">✍️</span>
                        <h3 className="font-extrabold text-amber-950 text-sm sm:text-base">
                          Send Direct Message to Apiary Team
                        </h3>
                      </div>
                      <span className="text-xs text-amber-700 font-semibold bg-amber-100 px-2.5 py-1 rounded-full break-all">
                        From: {user?.email}
                      </span>
                    </div>

                    <form onSubmit={handleSendMessage} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-amber-900 mb-1.5">
                          Inquiry Topic / Subject *
                        </label>
                        <select
                          value={composeTopic}
                          onChange={(e) => setComposeTopic(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-white font-medium text-amber-950 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                        >
                          {INQUIRY_TOPICS.map((topic) => (
                            <option key={topic} value={topic}>
                              {topic}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-amber-900 mb-1.5">
                          Your Message / Inquiry *
                        </label>
                        <textarea
                          rows={4}
                          required
                          value={composeText}
                          onChange={(e) => setComposeText(e.target.value)}
                          placeholder="Write your question, harvest inquiry, bulk honey request, or feedback here... Our team will review and reply swiftly!"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-white font-normal text-amber-950 text-xs sm:text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none resize-y"
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowCompose(false)}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSendingMessage}
                          className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                        >
                          {isSendingMessage ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <span>📤</span>
                              <span>Send Direct Message</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Loading State */}
                {loadingMessages && (
                  <div className="bg-white/80 rounded-3xl p-12 text-center border border-amber-200 shadow-sm flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-amber-900 font-semibold">Loading your conversations...</p>
                  </div>
                )}

                {/* Error State */}
                {!loadingMessages && messagesError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
                    <p className="font-semibold">{messagesError}</p>
                    <button
                      onClick={fetchMessages}
                      className="mt-3 px-5 py-2 bg-amber-600 text-white rounded-full font-bold text-sm hover:bg-amber-700 transition-colors"
                    >
                      Retry Loading
                    </button>
                  </div>
                )}

                {/* Empty State: When filter is 'unread' but no unread replies exist */}
                {!loadingMessages && !messagesError && messageFilter === 'unread' && filteredUserMessages.length === 0 && (
                  <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 sm:p-12 text-center border border-amber-200 shadow-md max-w-md mx-auto">
                    <span className="text-5xl block mb-3">🎉</span>
                    <h3 className="text-lg sm:text-xl font-bold text-amber-950">No unread replies!</h3>
                    <p className="text-gray-600 text-xs sm:text-sm mt-2 mb-5">
                      You have caught up with all responses from our apiary team.
                    </p>
                    <button
                      onClick={() => {
                        setMessageFilter('all');
                        setSearchParams({ tab: 'messages', filter: 'all' });
                      }}
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-full text-xs shadow-md transition-all"
                    >
                      View All Messages ({messages.length})
                    </button>
                  </div>
                )}

                {/* Empty State: When no messages exist at all */}
                {!loadingMessages && !messagesError && messages.length === 0 && (
                  <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 sm:p-12 text-center border border-amber-200 shadow-lg max-w-md mx-auto">
                    <span className="text-6xl block mb-3">💬</span>
                    <h3 className="text-xl font-bold text-amber-950">No inquiries yet</h3>
                    <p className="text-gray-600 text-sm mt-2 mb-6">
                      Have questions about our pure desert harvests, custom orders, or apiculture? Send a direct message to Dr. Sitaram Seervi & our team!
                    </p>
                    <button
                      onClick={() => setShowCompose(true)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all text-sm"
                    >
                      <span>✍️</span> Send Your First Inquiry
                    </button>
                  </div>
                )}

                {/* Messages List */}
                {!loadingMessages && !messagesError && filteredUserMessages.length > 0 && (
                  <div className="space-y-6">
                    {filteredUserMessages.map((msg) => {
                      const msgDate = msg.created_at
                        ? new Date(msg.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'Recent';

                      const replyDate = msg.replied_at
                        ? new Date(msg.replied_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : null;

                      const isUnreadReply = !msg.is_read_by_user && msg.admin_reply;

                      return (
                        <div
                          key={msg.id}
                          className={`bg-white/95 backdrop-blur-md rounded-3xl shadow-xl border overflow-hidden transition-all ${
                            isUnreadReply
                              ? 'border-red-400 ring-2 ring-red-200'
                              : 'border-amber-200 hover:shadow-2xl'
                          }`}
                        >
                          {/* Message Header */}
                          <div className="bg-gradient-to-r from-amber-500/10 via-amber-100/50 to-orange-50/50 px-4 sm:px-6 py-4 border-b border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-amber-950 text-sm sm:text-base">
                                  {msg.subject || 'Apiary Inquiry'}
                                </span>
                                {isUnreadReply && (
                                  <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                                    ✨ New Reply
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-500">Sent on: {msgDate}</span>
                            </div>

                            <div className="flex items-center gap-2 self-start sm:self-auto">
                              {msg.status === 'replied' ? (
                                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-sm">
                                  <span>✅</span> Replied by Apiary
                                </span>
                              ) : (
                                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 shadow-sm">
                                  <span>⏳</span> Awaiting Apiary Reply
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Message Body */}
                          <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                            {/* Customer Question */}
                            <div className="bg-amber-50/50 rounded-2xl p-3.5 sm:p-4 border border-amber-200/70">
                              <span className="text-xs font-bold text-amber-800 block mb-1">
                                💬 Your Message:
                              </span>
                              <p className="text-xs sm:text-sm text-amber-950 font-normal whitespace-pre-wrap leading-relaxed break-words">
                                {msg.message}
                              </p>
                            </div>

                            {/* Official Admin / Apiary Reply */}
                            {msg.admin_reply ? (
                              <div className="bg-gradient-to-br from-amber-100/70 via-orange-50/80 to-amber-50 rounded-2xl p-4 sm:p-5 border-2 border-amber-300 shadow-md">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-amber-300/80">
                                  <div className="flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-full bg-amber-600 text-white text-xs font-black flex items-center justify-center shadow">
                                      👑
                                    </span>
                                    <div>
                                      <h4 className="font-extrabold text-amber-950 text-xs sm:text-sm">
                                        Official Response from Aai Ji Honey Apiary Team
                                      </h4>
                                      {replyDate && (
                                        <span className="text-[11px] text-amber-800 font-medium block">
                                          Replied: {replyDate}
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {isUnreadReply ? (
                                    <button
                                      onClick={() => handleMarkAsRead(msg.id)}
                                      className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-full text-xs shadow transition-all flex items-center gap-1 self-start sm:self-auto"
                                    >
                                      <span>✓</span> Mark as Read
                                    </button>
                                  ) : (
                                    <span className="text-emerald-700 font-bold text-xs flex items-center gap-1 self-start sm:self-auto">
                                      <span>✓</span> Read
                                    </span>
                                  )}
                                </div>

                                <p className="text-xs sm:text-sm font-medium text-amber-950 whitespace-pre-wrap leading-relaxed break-words">
                                  {msg.admin_reply}
                                </p>

                                <div className="mt-3 sm:mt-4 pt-3 border-t border-amber-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-amber-800/80">
                                  <span className="break-all">📬 A copy of this reply was also emailed to {msg.email}</span>
                                  {!isUnreadReply && (
                                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                                      <span>✓</span> Acknowledged
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="text-xs text-amber-800/80 bg-amber-50/40 p-3.5 rounded-xl border border-dashed border-amber-300 flex items-center gap-2">
                                <span className="animate-spin text-base">⏳</span>
                                <span>
                                  Our entomologist and apiary team have received your message and will reply shortly. You'll receive an email notification and an alert here!
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Rating Modal for Purchased Orders */}
      <RatingModal
        isOpen={!!ratingModalProduct}
        product={ratingModalProduct}
        onClose={() => setRatingModalProduct(null)}
        onSuccess={() => {
          fetchOrders();
        }}
      />
    </div>
  );
};

export default UserProfilePage;
