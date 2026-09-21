import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { paymentApi } from '../../../api/paymentApi';
import { orderApi } from '../../../api/orderApi';
import { calculateOrderPrice, DISCOUNT_PERCENTAGE } from '../../../utils/priceCalculator';
import useAuth from '../../../hooks/useAuth';
import AddressInputFields from '../../../components/common/AddressInputFields';
import { formatDeliveryAddress, parseDeliveryAddress } from '../../../utils/addressFormatter';

const OrderModal = ({ product, onClose }) => {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
    email: user?.email || '',
    quantity: 1,
  });
  const [addressFields, setAddressFields] = useState(() =>
    parseDeliveryAddress(user?.address || '')
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const priceDetails = calculateOrderPrice(product.price, formData.quantity);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? Math.max(1, parseInt(value, 10) || 1) : value,
    }));
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullAddress = formatDeliveryAddress(addressFields);

    if (!formData.name.trim() || !formData.mobile.trim() || !fullAddress) {
      toast.error('Please fill in your name, mobile, and complete delivery address.');
      return;
    }

    if (!addressFields.house?.trim() || !addressFields.street?.trim() || !addressFields.city?.trim() || !addressFields.pin?.trim()) {
      toast.error('Please fill in House No., Street, City, and PIN code for reliable delivery.');
      return;
    }

    if (addressFields.pin && !/^[0-9]{6}$/.test(addressFields.pin.trim())) {
      toast.error('PIN code must be a valid 6-digit number.');
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.mobile.trim())) {
      toast.error('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        toast.error('Failed to load Razorpay payment gateway. Please check your internet connection.');
        setIsSubmitting(false);
        return;
      }

      // Step 1: Create Razorpay Order on server
      const orderData = await paymentApi.createOrder(priceDetails.amountInPaise);

      if (!orderData || !orderData.order || !orderData.order.id) {
        toast.error('Payment gateway initialization failed.');
        setIsSubmitting(false);
        return;
      }

      const razorpayKey =
        import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_live_RwJfWahqgcNYJS';

      const options = {
        key: razorpayKey,
        amount: priceDetails.amountInPaise,
        currency: 'INR',
        name: 'Aai-Ji Honey',
        description: `Purchase of ${product.name}`,
        order_id: orderData.order.id,
        handler: async (response) => {
          try {
            // Step 2: Submit and persist completed order in database
            const finalOrder = {
              name: formData.name,
              mobile: formData.mobile,
              email: formData.email,
              address: fullAddress,
              quantity: parseInt(formData.quantity, 10),
              userId: user?.id || null,
              product: {
                id: product._id || product.id,
                name: product.name,
                price: product.price,
                totalprice: priceDetails.totalInRupees,
                image: product.image,
                flavour: product.flavour,
              },
              paymentId: response.razorpay_payment_id,
            };

            await orderApi.createOrder(finalOrder);
            toast.success('✅ Order placed successfully!');
            onClose();
          } catch (saveError) {
            console.error('Error saving order after payment:', saveError);
            toast.error('Payment received but failed to record order. Please contact support.');
          } finally {
            setIsSubmitting(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile,
        },
        theme: {
          color: '#f59e0b',
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error('Unable to connect to the payment server. Please try again later.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] my-8 overflow-hidden animate-[scaleIn_0.3s_ease-out]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 text-white p-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍯</span>
            <div>
              <h2 className="text-xl font-black font-heading leading-tight">Order & Checkout</h2>
              <p className="text-amber-100 text-xs">Direct from Rajasthan Hives • Express Delivery</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-lg transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Product Overview Card with Flavour & Description */}
        <div className="p-5 pb-0 flex-shrink-0">
          <div className="bg-gradient-to-br from-amber-50/90 to-yellow-50/90 rounded-2xl p-4 border border-amber-200/90 shadow-sm flex items-start gap-4">
            <img
              src={product.image || '/placeholder.jpg'}
              alt={product.name}
              className="w-20 h-20 object-contain rounded-xl bg-white p-1 border border-amber-200/80 shadow-xs flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                  🌼 {product.flavour || 'Wild Flora Blossom'}
                </span>
                <span className="text-xs font-bold text-amber-900">
                  ₹{product.price} / jar
                </span>
                {product.ratingCount > 0 && product.avgRating > 0 ? (
                  <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                    ⭐ {product.avgRating} ({product.ratingCount} {product.ratingCount === 1 ? 'review' : 'reviews'})
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
                    ☆ No ratings yet
                  </span>
                )}
              </div>
              <h3 className="font-black text-amber-950 text-base line-clamp-1">
                {product.name}
              </h3>
              <p className="text-xs text-amber-900/80 line-clamp-3 mt-1 leading-relaxed bg-white/60 p-2 rounded-lg border border-amber-100">
                {product.description ||
                  '100% Pure, raw unpasteurized honey harvested straight from ethical hives. Rich in natural bee pollen and enzymes.'}
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-1">👤 Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
              className="w-full border-2 border-amber-200 p-3 rounded-xl focus:outline-none focus:border-amber-500 transition-colors bg-amber-50/30"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-1">📱 Mobile Number *</label>
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="10-digit mobile number"
              required
              maxLength={10}
              className="w-full border-2 border-amber-200 p-3 rounded-xl focus:outline-none focus:border-amber-500 transition-colors bg-amber-50/30"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-1">✉️ Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com"
              className="w-full border-2 border-amber-200 p-3 rounded-xl focus:outline-none focus:border-amber-500 transition-colors bg-amber-50/30"
            />
          </div>

          {/* Delivery Address (Structured Format) */}
          <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-bold text-amber-900">
                📍 Delivery Address *
              </label>
              {user?.address && (
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  ✓ Pre-filled from profile
                </span>
              )}
            </div>
            <AddressInputFields
              values={addressFields}
              onChange={setAddressFields}
              required={true}
              showPreview={true}
              compact={true}
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-1">📦 Quantity</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    quantity: Math.max(1, prev.quantity - 1),
                  }))
                }
                className="w-10 h-10 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold flex items-center justify-center transition-colors"
              >
                -
              </button>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="1"
                className="w-20 text-center border-2 border-amber-200 p-2 rounded-xl font-bold text-amber-900 bg-white"
              />
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    quantity: prev.quantity + 1,
                  }))
                }
                className="w-10 h-10 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold flex items-center justify-center transition-colors"
              >
                +
              </button>
              <span className="text-sm text-gray-500">units</span>
            </div>
          </div>

          {/* Price Breakdown Card */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-4 border-2 border-amber-200 space-y-2 text-sm text-gray-700">
            <p className="font-bold text-amber-900 mb-2 flex items-center justify-between">
              <span>💰 Price Summary</span>
              <span className="text-xs bg-green-100 text-green-800 font-semibold px-2 py-0.5 rounded-full">
                {DISCOUNT_PERCENTAGE}% Festive Discount Applied
              </span>
            </p>
            <div className="flex justify-between">
              <span>Original Total:</span>
              <span className="line-through text-gray-400">₹{priceDetails.originalPrice}</span>
            </div>
            <div className="flex justify-between text-green-700 font-medium">
              <span>Discount (-{DISCOUNT_PERCENTAGE}%):</span>
              <span>-₹{priceDetails.discountAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discounted Base:</span>
              <span>₹{priceDetails.basePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Platform & GST Surcharge:</span>
              <span>₹{priceDetails.surcharge.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Delivery Charges:</span>
              <span className="text-green-600 font-semibold">FREE</span>
            </div>
            <div className="border-t-2 border-amber-200 pt-2 mt-2 flex justify-between font-bold text-amber-950 text-base">
              <span>Total Payable:</span>
              <span className="text-xl text-amber-600">₹{priceDetails.totalInRupees}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-2 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span> Processing...
                </>
              ) : (
                <>💳 Pay ₹{priceDetails.totalInRupees} with Razorpay</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderModal;
