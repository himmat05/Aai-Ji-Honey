import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAuth from '../../hooks/useAuth';
import { customerAuthApi } from '../../api/customerAuthApi';
import { orderApi } from '../../api/orderApi';
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

  useEffect(() => {
    fetchOrders();
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
            My Account & Order Tracking
          </h1>
          <p className="text-xs sm:text-sm text-amber-900/80 font-medium">
            Manage your personal delivery details and track your Rajasthan honey shipments
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
          {/* RIGHT COLUMN: Order History & Visual Tracking */}
          {/* ========================================================= */}
          <div className="lg:col-span-2 space-y-6">
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
