import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { paymentApi } from '../../../api/paymentApi';
import couponApi from '../../../api/couponApi';
import useAuth from '../../../hooks/useAuth';
import useCart from '../../../hooks/useCart';
import AddressInputFields from '../../../components/common/AddressInputFields';
import { formatDeliveryAddress, parseDeliveryAddress } from '../../../utils/addressFormatter';

const OrderModal = ({ product = null, initialQuantity = 1, isCartCheckout = false, onClose }) => {
  const { user } = useAuth();
  const { cart, items: cartItems, clearCart, buyNowItem, clearBuyNowItem, refreshCart } = useCart();

  // If Buy Now item is set in context, prioritize it
  const activeProduct = product || buyNowItem?.product || null;
  const startQty = buyNowItem?.quantity || initialQuantity || 1;

  const [formData, setFormData] = useState({
    name: user?.name || '',
    mobile: user?.mobile || '',
    email: user?.email || '',
    quantity: startQty,
  });

  const [addressFields, setAddressFields] = useState(() =>
    parseDeliveryAddress(user?.address || '')
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Buy Now Promo Code states
  const [inputCoupon, setInputCoupon] = useState('');
  const [buyNowCoupon, setBuyNowCoupon] = useState(null);
  const [couponError, setCouponError] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(true);

  // Fetch active public coupons when modal opens
  useEffect(() => {
    let isMounted = true;
    const fetchCoupons = async () => {
      try {
        setLoadingCoupons(true);
        const data = await couponApi.getPublicCoupons();
        if (isMounted && data?.coupons) {
          setAvailableCoupons(data.coupons);
        }
      } catch (err) {
        console.error('Error fetching public coupons in OrderModal:', err);
      } finally {
        if (isMounted) setLoadingCoupons(false);
      }
    };
    fetchCoupons();
    return () => {
      isMounted = false;
    };
  }, []);

  // Price calculations
  const isBuyNow = !isCartCheckout && activeProduct;
  const singleItemSubtotal = isBuyNow ? activeProduct.price * formData.quantity : 0;
  const singleItemOriginal = isBuyNow ? (activeProduct.originalPrice || Math.round(activeProduct.price * 1.25)) * formData.quantity : 0;
  const singleItemCouponDiscount = isBuyNow ? (buyNowCoupon?.discount || 0) : 0;
  const singleTaxable = Math.max(0, singleItemSubtotal - singleItemCouponDiscount);
  const singleItemShipping = (singleItemSubtotal === 0 || singleItemSubtotal >= 999) ? 0 : 50;
  const singleItemTax = Math.round(singleTaxable * 0.05);
  const singleGrandTotal = Math.max(0, singleTaxable + singleItemShipping + singleItemTax);

  const totalPayable = isCartCheckout ? cart.total : singleGrandTotal;
  const totalSubtotal = isCartCheckout ? cart.subtotal : singleItemSubtotal;
  const totalShipping = isCartCheckout ? cart.shipping : singleItemShipping;
  const totalTax = isCartCheckout ? cart.tax : singleItemTax;
  const appliedCouponDiscount = isCartCheckout ? (cart.couponDiscount || 0) : singleItemCouponDiscount;
  const activeAppliedCoupon = isCartCheckout ? cart.appliedCoupon : buyNowCoupon;

  // Re-evaluate applied Buy Now coupon when quantity changes
  useEffect(() => {
    if (!isCartCheckout && buyNowCoupon && activeProduct) {
      const currentSubtotal = activeProduct.price * formData.quantity;
      if (buyNowCoupon.minOrderAmount && currentSubtotal < buyNowCoupon.minOrderAmount) {
        toast.warn(`Promo code ${buyNowCoupon.code} requires a minimum order of ₹${buyNowCoupon.minOrderAmount}. Coupon removed.`);
        setBuyNowCoupon(null);
        setCouponError(`Promo code ${buyNowCoupon.code} requires min order of ₹${buyNowCoupon.minOrderAmount}.`);
      } else {
        const calculated = Math.round((currentSubtotal * buyNowCoupon.discountPercentage) / 100);
        const newDiscount = buyNowCoupon.maxDiscount
          ? Math.min(calculated, buyNowCoupon.maxDiscount)
          : calculated;
        if (newDiscount !== buyNowCoupon.discount) {
          setBuyNowCoupon((prev) => (prev ? { ...prev, discount: newDiscount } : null));
        }
      }
    }
  }, [formData.quantity, activeProduct, isCartCheckout, buyNowCoupon?.code]);

  const handleApplyBuyNowCoupon = async (codeOverride) => {
    const targetCode = String(codeOverride || inputCoupon).trim().toUpperCase();
    if (!targetCode) {
      toast.warn('Please enter a promo code.');
      return;
    }

    setCouponLoading(true);
    setCouponError(null);

    try {
      const res = await couponApi.validateCoupon({
        code: targetCode,
        subtotal: singleItemSubtotal,
      });

      if (res?.valid && res.coupon) {
        setBuyNowCoupon(res.coupon);
        setInputCoupon('');
        setCouponError(null);
        toast.success(`🎉 Promo code ${res.coupon.code} applied! Saved ₹${res.coupon.discount}`);
      } else {
        const msg = res?.message || 'Invalid or expired promo code.';
        setCouponError(msg);
        toast.error(msg);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to validate promo code.';
      setCouponError(msg);
      toast.error(msg);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveBuyNowCoupon = () => {
    setBuyNowCoupon(null);
    setInputCoupon('');
    setCouponError(null);
    toast.info('Promo code removed');
  };

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

      // Step 1: Create Razorpay Order on server with server-calculated amount
      let orderPayload;
      if (isCartCheckout) {
        orderPayload = {
          items: cartItems.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          coupon: cart.appliedCoupon?.code || null,
        };
      } else {
        orderPayload = {
          productId: activeProduct._id || activeProduct.id,
          quantity: parseInt(formData.quantity, 10) || 1,
          coupon: buyNowCoupon?.code || null,
        };
      }

      const orderData = await paymentApi.createOrder(orderPayload);

      if (!orderData || !orderData.order || !orderData.order.id || !orderData.keyId) {
        toast.error(orderData?.error || 'Payment gateway initialization failed.');
        setIsSubmitting(false);
        return;
      }

      const razorpayKey = orderData.keyId;

      const options = {
        key: razorpayKey,
        amount: orderData.order.amount,
        currency: orderData.order.currency || 'INR',
        name: 'Aai-Ji Honey',
        description: isCartCheckout
          ? `Cart Checkout (${cart.itemCount} items)`
          : `Purchase of ${activeProduct.name}`,
        order_id: orderData.order.id,
        handler: async (response) => {
          try {
            // Step 2: Cryptographically verify HMAC-SHA256 signature server-side and persist order
            const verificationPayload = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderDetails: {
                name: formData.name,
                mobile: formData.mobile,
                email: formData.email,
                address: fullAddress,
                quantity: isCartCheckout ? cart.itemCount : parseInt(formData.quantity, 10),
                userId: user?.id || null,
                isBuyNow: !isCartCheckout,
                coupon: activeAppliedCoupon?.code || null,
                couponDiscount: appliedCouponDiscount || 0,
                items: isCartCheckout
                  ? cartItems.map((i) => ({
                      productId: i.productId,
                      id: i.productId,
                      name: i.name,
                      price: i.price,
                      quantity: i.quantity,
                      totalprice: i.itemSubtotal,
                      flavour: i.flavour,
                      image: i.image,
                    }))
                  : [
                      {
                        productId: activeProduct._id || activeProduct.id,
                        id: activeProduct._id || activeProduct.id,
                        name: activeProduct.name,
                        price: activeProduct.price,
                        quantity: parseInt(formData.quantity, 10),
                        totalprice: singleItemSubtotal,
                        flavour: activeProduct.flavour,
                        image: activeProduct.image,
                      },
                    ],
                product: isCartCheckout
                  ? {
                      name: `Cart Checkout (${cart.itemCount} Jars)`,
                      totalprice: totalPayable,
                      itemsCount: cart.itemCount,
                    }
                  : {
                      id: activeProduct._id || activeProduct.id,
                      name: activeProduct.name,
                      price: activeProduct.price,
                      totalprice: totalPayable,
                      image: activeProduct.image,
                      flavour: activeProduct.flavour,
                      coupon: buyNowCoupon?.code || null,
                      couponDiscount: buyNowCoupon?.discount || 0,
                    },
              },
            };

            const verificationResult = await paymentApi.verifyPayment(verificationPayload);
            if (verificationResult && verificationResult.success) {
              toast.success('✅ Payment verified & Order placed successfully!');

              if (isCartCheckout) {
                await clearCart();
              } else {
                clearBuyNowItem();
                // Refresh cart to reconcile if purchased product was also in cart
                refreshCart();
              }

              onClose();
            } else {
              toast.error(verificationResult?.message || 'Payment signature verification failed.');
            }
          } catch (saveError) {
            console.error('Error verifying payment/order:', saveError);
            toast.error(
              saveError.response?.data?.message ||
                `Payment received but verification failed. Please contact support with Payment ID: ${response.razorpay_payment_id}`
            );
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
      toast.error(err.response?.data?.error || 'Unable to connect to the payment server.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] my-8 overflow-hidden animate-[scaleIn_0.3s_ease-out] text-left">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 text-white p-5 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍯</span>
            <div>
              <h2 className="text-xl font-black font-heading leading-tight">
                {isCartCheckout ? 'Cart Checkout' : 'Buy Now Checkout'}
              </h2>
              <p className="text-amber-100 text-xs">
                {isCartCheckout
                  ? `${cart.itemCount} items from your shopping cart`
                  : 'Direct single-item express order'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-lg transition-colors cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Product / Cart Overview Preview */}
        <div className="p-5 pb-0 flex-shrink-0">
          {isCartCheckout ? (
            <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200/90 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-black text-amber-900 border-b border-amber-200 pb-2">
                <span>Items in Order ({cartItems.length} varieties)</span>
                <span>Total: {cart.itemCount} jars</span>
              </div>
              <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1 divide-y divide-amber-100">
                {cartItems.map((item) => (
                  <div key={item.productId} className="pt-1.5 first:pt-0 flex items-center justify-between text-xs">
                    <span className="text-amber-950 font-bold truncate max-w-[220px]">
                      {item.quantity} × {item.name}
                    </span>
                    <span className="font-black text-amber-950">
                      ₹{item.itemSubtotal}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : activeProduct ? (
            <div className="bg-gradient-to-br from-amber-50/90 to-yellow-50/90 rounded-2xl p-4 border border-amber-200/90 shadow-sm flex items-start gap-4">
              <img
                src={activeProduct.image || '/placeholder.jpg'}
                alt={activeProduct.name}
                className="w-16 h-16 object-contain rounded-xl bg-white p-1 border border-amber-200/80 shadow-xs flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                  🌼 {activeProduct.flavour || 'Raw Blossom'}
                </span>
                <h3 className="font-black text-amber-950 text-sm line-clamp-1 mt-1">
                  {activeProduct.name}
                </h3>
                <div className="flex items-center justify-between text-xs font-bold text-amber-900 mt-1">
                  <span>₹{activeProduct.price} / Jar</span>
                  <span className="text-emerald-700">Stock: {activeProduct.stock}</span>
                </div>
              </div>
            </div>
          ) : null}
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
              className="w-full border-2 border-amber-200 p-3 rounded-xl focus:outline-none focus:border-amber-500 transition-colors bg-amber-50/30 text-amber-950 font-bold text-sm"
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
              className="w-full border-2 border-amber-200 p-3 rounded-xl focus:outline-none focus:border-amber-500 transition-colors bg-amber-50/30 text-amber-950 font-bold text-sm"
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
              className="w-full border-2 border-amber-200 p-3 rounded-xl focus:outline-none focus:border-amber-500 transition-colors bg-amber-50/30 text-amber-950 font-bold text-sm"
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
                  ✓ Pre-filled
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

          {/* Quantity Selector (Only if Buy Now mode) */}
          {!isCartCheckout && activeProduct && (
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
                  max={activeProduct.stock || 50}
                  className="w-20 text-center border-2 border-amber-200 p-2 rounded-xl font-bold text-amber-900 bg-white"
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      quantity: Math.min(activeProduct.stock || 50, prev.quantity + 1),
                    }))
                  }
                  className="w-10 h-10 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold flex items-center justify-center transition-colors"
                >
                  +
                </button>
                <span className="text-sm text-gray-500">jars</span>
              </div>
            </div>
          )}

          {/* Promo Code Section (Buy Now Mode) */}
          {!isCartCheckout && (
            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/90 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-amber-950 uppercase tracking-wider">
                  🏷️ Apply Promo Code
                </label>
                {buyNowCoupon && (
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                    Active: {buyNowCoupon.code}
                  </span>
                )}
              </div>

              {!buyNowCoupon ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                    placeholder="Enter Promo Code"
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-white border border-amber-300 text-amber-950 font-bold text-xs uppercase placeholder:normal-case placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyBuyNowCoupon()}
                    disabled={!inputCoupon.trim() || couponLoading}
                    className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-black text-xs uppercase rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {couponLoading ? (
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : null}
                    <span>{couponLoading ? 'Checking...' : 'Apply'}</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 font-black">✓ {buyNowCoupon.code}</span>
                    <span className="text-emerald-800 font-semibold text-[11px]">
                      ({buyNowCoupon.description || `${buyNowCoupon.discountPercentage}% OFF`})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveBuyNowCoupon}
                    className="text-red-500 hover:text-red-700 font-bold text-xs underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}

              {couponError && (
                <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                  <span>⚠️</span>
                  <span>{couponError}</span>
                </p>
              )}

              {/* Available Coupons list or No Promo Code Available */}
              {!buyNowCoupon && (
                <div className="pt-1">
                  {loadingCoupons ? (
                    <div className="text-[11px] text-amber-800/70 flex items-center gap-1.5 font-medium py-0.5">
                      <span className="w-3 h-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></span>
                      <span>Loading available promo codes...</span>
                    </div>
                  ) : availableCoupons.length > 0 ? (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-amber-900/80">Available Vouchers:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {availableCoupons.map((c) => (
                          <button
                            key={c.id || c.code}
                            type="button"
                            onClick={() => {
                              setInputCoupon(c.code);
                              handleApplyBuyNowCoupon(c.code);
                            }}
                            className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 transition-all flex items-center gap-1 cursor-pointer"
                            title={c.description || `${c.discount_percentage}% OFF`}
                          >
                            <span>🏷️</span>
                            <span>{c.code}</span>
                            <span className="text-emerald-800 font-extrabold bg-emerald-100 px-1 py-0.2 rounded text-[9px]">
                              {c.discount_percentage}% OFF
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-amber-100/40 border border-amber-200 text-xs text-amber-900/80 flex items-center gap-2 font-medium">
                      <span>🏷️</span>
                      <span>No promo code available at the moment</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Price Summary Breakdown */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-4 border-2 border-amber-200 space-y-2 text-sm text-gray-700">
            <p className="font-bold text-amber-900 mb-2 flex items-center justify-between">
              <span>💰 Price Summary</span>
              {activeAppliedCoupon && (
                <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                  🏷️ {activeAppliedCoupon.code} Applied
                </span>
              )}
            </p>
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-bold text-amber-950">₹{totalSubtotal}</span>
            </div>
            {appliedCouponDiscount > 0 && activeAppliedCoupon && (
              <div className="flex justify-between items-center text-xs bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-200">
                <div className="flex items-center gap-1.5">
                  <span>🏷️ Promo Discount ({activeAppliedCoupon.code}):</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-sm">-₹{appliedCouponDiscount}</span>
                  {!isCartCheckout && (
                    <button
                      type="button"
                      onClick={handleRemoveBuyNowCoupon}
                      className="text-red-500 hover:text-red-700 text-xs font-bold underline cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            )}
            <div className="flex justify-between text-xs text-gray-600">
              <span>Express Delivery:</span>
              <span>
                {totalShipping === 0 ? (
                  <strong className="text-emerald-700 font-bold">FREE</strong>
                ) : (
                  `₹${totalShipping}`
                )}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Estimated GST (5%):</span>
              <span className="font-bold text-amber-950">₹{totalTax}</span>
            </div>
            <div className="border-t-2 border-amber-200 pt-2 mt-2 flex justify-between font-bold text-amber-950 text-base">
              <span>Total Payable:</span>
              <span className="text-2xl text-amber-950 font-heading">₹{totalPayable}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-2 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span> Processing...
                </>
              ) : (
                <>💳 Pay ₹{totalPayable} with Razorpay</>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default OrderModal;
