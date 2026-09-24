import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';
import couponApi from '../../api/couponApi';
import OrderModal from '../Products/components/OrderModal';

const CartPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const {
    items,
    savedForLater,
    itemCount,
    subtotal,
    productDiscount,
    couponDiscount,
    appliedCoupon,
    couponError,
    shipping,
    freeShippingThreshold,
    freeShippingRemaining,
    tax,
    total,
    isValidForCheckout,
    changes,
    loading,
    actionLoading,
    couponLoading,
    updateQuantity,
    removeFromCart,
    clearCart,
    saveForLater,
    moveToCart,
    removeSavedItem,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [loadingCoupons, setLoadingCoupons] = useState(true);

  // Fetch live active promo codes configured by admin
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
        console.error('Error fetching available promo codes:', err);
      } finally {
        if (isMounted) setLoadingCoupons(false);
      }
    };
    fetchCoupons();
    return () => {
      isMounted = false;
    };
  }, []);

  const freeShippingPercent = Math.min(
    100,
    Math.round(((freeShippingThreshold - freeShippingRemaining) / freeShippingThreshold) * 100)
  );

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (inputCoupon.trim()) {
      applyCoupon(inputCoupon.trim());
    }
  };

  const handleProceedToCheckout = () => {
    if (!isValidForCheckout || items.length === 0) return;
    setIsCheckoutModalOpen(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="honey-glass rounded-3xl p-10 sm:p-16 border border-amber-200/90 shadow-2xl max-w-2xl mx-auto space-y-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-amber-100 to-amber-200 flex items-center justify-center text-5xl shadow-inner animate-[bounce_1s_ease-out_1]">
            🔐
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-amber-950 font-heading">
              Sign In to View Your Cart
            </h1>
            <p className="text-sm sm:text-base text-amber-900/80 max-w-md mx-auto font-medium">
              Please sign in or create an account to view, save, and manage items in your pure raw honey cart.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => navigate('/login?redirect=/cart')}
              className="btn-honey-primary px-8 py-4 text-sm font-black uppercase tracking-wider inline-flex items-center gap-2 shadow-xl hover:scale-105 cursor-pointer"
            >
              <span>🔑</span>
              <span>Sign In to Continue</span>
              <span>→</span>
            </button>

            <button
              onClick={() => navigate('/login?mode=signup&redirect=/cart')}
              className="px-6 py-4 honey-glass border border-amber-300 text-amber-950 hover:bg-amber-100/60 font-bold rounded-full text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              <span>✨</span> <span>Create Free Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading && items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 border-4 border-amber-300 border-t-amber-600 rounded-full animate-spin mx-auto mb-4" />
        <h2 className="font-heading font-black text-xl text-amber-950">
          Loading Your Honey Cart...
        </h2>
      </div>
    );
  }

  if (items.length === 0 && savedForLater.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
        <div className="honey-glass rounded-3xl p-10 sm:p-16 border border-amber-200/90 shadow-2xl max-w-2xl mx-auto space-y-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-amber-100 to-amber-200 flex items-center justify-center text-5xl shadow-inner animate-[bounce_1s_ease-out_1]">
            🍯
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-black text-amber-950 font-heading">
              Your Shopping Cart is Empty
            </h1>
            <p className="text-sm sm:text-base text-amber-900/80 max-w-md mx-auto font-medium">
              You haven't added any pure raw honey jars to your cart yet. Explore our cold-extracted harvest straight from Rajasthan apiaries.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              to="/products"
              className="btn-honey-primary px-8 py-4 text-sm font-black uppercase tracking-wider inline-flex items-center gap-2 shadow-xl hover:scale-105"
            >
              <span>🛍️</span>
              <span>Explore Raw Honey Collection</span>
              <span>→</span>
            </Link>

            <Link
              to="/about"
              className="px-6 py-4 honey-glass border border-amber-300 text-amber-950 hover:bg-amber-100/60 font-bold rounded-full text-xs uppercase tracking-wider transition-all"
            >
              <span>🐝</span> <span>Learn Our Story</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-left space-y-8">
      
      {/* Header Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-widest mb-1">
            <Link to="/" className="hover:underline">Home</Link>
            <span>/</span>
            <Link to="/products" className="hover:underline">Shop</Link>
            <span>/</span>
            <span className="text-amber-950">Shopping Cart</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-amber-950 font-heading">
            Your Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm font-bold text-amber-800 mt-1">
            {itemCount} {itemCount === 1 ? 'jar' : 'jars'} selected for delivery
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/products"
            className="px-5 py-2.5 honey-glass border border-amber-300 text-amber-950 hover:bg-amber-100/70 font-bold text-xs uppercase tracking-wider rounded-full shadow-xs transition-all inline-flex items-center gap-1.5"
          >
            <span>←</span>
            <span>Continue Shopping</span>
          </Link>
          {items.length > 0 && (
            <button
              onClick={clearCart}
              disabled={actionLoading}
              className="px-4 py-2.5 text-xs font-bold text-red-600 hover:text-white hover:bg-red-500 border border-red-200 rounded-full transition-all"
            >
              Clear Cart
            </button>
          )}
        </div>
      </div>

      {/* Free Shipping Alert Banner */}
      <div className="honey-glass rounded-2xl p-4 sm:p-5 border border-amber-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🚚</span>
          <div>
            <p className="font-heading font-black text-sm sm:text-base text-amber-950">
              {freeShippingRemaining > 0
                ? `Add ₹${freeShippingRemaining} more to unlock Free Express Delivery!`
                : '🎉 You have unlocked Free Express Delivery!'}
            </p>
            <p className="text-xs text-amber-800">
              All orders above ₹{freeShippingThreshold} ship with temperature-monitored protective glass packaging.
            </p>
          </div>
        </div>

        {freeShippingRemaining > 0 && (
          <div className="w-full sm:w-48 space-y-1">
            <div className="flex justify-between text-[11px] font-bold text-amber-900">
              <span>Progress</span>
              <span>{freeShippingPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-amber-200/80 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${freeShippingPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Changes / Stock Warning Alert if any items were adjusted */}
      {changes && changes.length > 0 && (
        <div className="bg-amber-100/90 border-l-4 border-amber-600 p-4 rounded-xl shadow-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-amber-950 text-sm">
            <span>⚠️</span>
            <span>Cart Updates Notice</span>
          </div>
          {changes.map((c, idx) => (
            <p key={idx} className="text-xs text-amber-900 ml-6">
              • {c.message}
            </p>
          ))}
        </div>
      )}

      {/* Main Grid: Items Column (Left) + Order Summary (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Cart Items & Saved for Later */}
        <div className="lg:col-span-8 space-y-6">
          
          {items.length === 0 ? (
            <div className="honey-glass rounded-3xl p-8 text-center space-y-3">
              <span className="text-4xl">🛒</span>
              <h3 className="font-heading font-black text-lg text-amber-950">
                All active items have been moved or saved for later
              </h3>
              <p className="text-xs text-amber-800">
                You can move items back from your Saved for Later shelf below or browse our products.
              </p>
            </div>
          ) : (
            <div className="honey-glass rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-xl space-y-6">
              <div className="hidden md:grid grid-cols-12 gap-4 pb-3 border-b border-amber-200/80 text-xs font-black text-amber-900 uppercase tracking-wider">
                <div className="col-span-6">Product Details</div>
                <div className="col-span-2 text-center">Unit Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>

              <div className="divide-y divide-amber-100 space-y-6 md:space-y-0">
                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="py-6 first:pt-0 last:pb-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
                  >
                    {/* Product Details (Image + Name + Tags) */}
                    <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-amber-50/80 border border-amber-200 p-2 flex-shrink-0 flex items-center justify-center shadow-inner">
                        <img
                          src={item.image || '/placeholder.jpg'}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div className="space-y-1 min-w-0">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                          {item.flavour}
                        </span>
                        <h4 className="font-heading font-black text-base sm:text-lg text-amber-950 truncate">
                          {item.name}
                        </h4>
                        
                        {/* Stock indicator */}
                        <div className="flex items-center gap-2 text-xs">
                          {!item.isAvailable || item.stock <= 0 ? (
                            <span className="text-red-600 font-bold">
                              ● Out of Stock
                            </span>
                          ) : item.stock < 5 ? (
                            <span className="text-amber-800 font-bold animate-pulse">
                              ⚠️ Limited Stock: Only {item.stock} left!
                            </span>
                          ) : (
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              ● In Stock ({item.stock} available)
                            </span>
                          )}
                        </div>

                        {/* Action links */}
                        <div className="flex items-center gap-3 pt-1 text-xs">
                          <button
                            onClick={() => saveForLater(item.productId)}
                            disabled={actionLoading}
                            className="font-bold text-amber-700 hover:text-amber-950 underline cursor-pointer"
                          >
                            Save for Later
                          </button>
                          <span className="text-stone-300">|</span>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            disabled={actionLoading}
                            className="font-bold text-red-600 hover:text-red-800 underline cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Unit Price */}
                    <div className="col-span-1 md:col-span-2 md:text-center flex md:flex-col justify-between items-baseline md:items-center">
                      <span className="md:hidden text-xs font-bold text-amber-800">Unit Price:</span>
                      <div>
                        <span className="font-black text-base text-amber-950 font-heading">
                          ₹{item.price}
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="text-xs text-gray-400 line-through block">
                            ₹{item.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Selector */}
                    <div className="col-span-1 md:col-span-2 flex md:justify-center items-center justify-between">
                      <span className="md:hidden text-xs font-bold text-amber-800">Quantity:</span>
                      <div className="flex items-center border-2 border-amber-300 rounded-xl overflow-hidden bg-white shadow-xs">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center text-amber-950 hover:bg-amber-100 active:bg-amber-200 font-black text-sm disabled:opacity-30 transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-9 text-center text-xs font-black text-amber-950 select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="w-8 h-8 flex items-center justify-center text-amber-950 hover:bg-amber-100 active:bg-amber-200 font-black text-sm disabled:opacity-30 transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Item Subtotal */}
                    <div className="col-span-1 md:col-span-2 md:text-right flex md:flex-col justify-between items-baseline md:items-end">
                      <span className="md:hidden text-xs font-bold text-amber-800">Subtotal:</span>
                      <div>
                        <span className="font-heading font-black text-lg text-amber-950">
                          ₹{item.itemSubtotal}
                        </span>
                        {item.discountPercentage > 0 && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 block md:inline-block">
                            {item.discountPercentage}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Saved for Later Shelf */}
          {savedForLater.length > 0 && (
            <div className="honey-glass rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-lg space-y-4">
              <div className="flex items-center gap-2 border-b border-amber-200/80 pb-3">
                <span className="text-xl">🔖</span>
                <h3 className="font-heading font-black text-xl text-amber-950">
                  Saved for Later ({savedForLater.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedForLater.map((sItem) => (
                  <div
                    key={sItem.productId}
                    className="p-4 rounded-2xl bg-white/90 border border-amber-200 flex items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={sItem.image || '/placeholder.jpg'}
                        alt={sItem.name}
                        className="w-14 h-14 rounded-xl object-contain bg-amber-50 p-1 border border-amber-100"
                      />
                      <div>
                        <h5 className="font-heading font-black text-sm text-amber-950 leading-snug line-clamp-1">
                          {sItem.name}
                        </h5>
                        <p className="text-xs font-black text-amber-950">
                          ₹{sItem.price}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => moveToCart(sItem.productId)}
                        disabled={actionLoading || !sItem.isAvailable}
                        className="btn-honey-primary px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider whitespace-nowrap disabled:opacity-40"
                      >
                        Move to Cart
                      </button>
                      <button
                        onClick={() => removeSavedItem(sItem.productId)}
                        disabled={actionLoading}
                        className="text-[11px] text-red-600 hover:underline font-bold text-center"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Order Summary & Checkout Card */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          <div className="honey-glass rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-2xl space-y-6">
            <h3 className="font-heading font-black text-2xl text-amber-950 border-b border-amber-200/80 pb-4">
              Order Summary
            </h3>

            {/* Price Breakdown */}
            <div className="space-y-3 text-sm text-amber-950/90 font-medium">
              <div className="flex justify-between">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-black text-amber-950">₹{subtotal}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between items-center bg-emerald-50 text-emerald-900 px-3 py-1.5 rounded-xl border border-emerald-300">
                  <div className="flex items-center gap-1.5">
                    <span>🏷️</span>
                    <span className="font-bold text-xs">{appliedCoupon.code}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-black">-₹{couponDiscount}</span>
                    <button
                      onClick={removeCoupon}
                      className="text-stone-400 hover:text-red-500 font-black text-xs"
                      title="Remove coupon"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span>Express Delivery</span>
                <span>
                  {shipping === 0 ? (
                    <strong className="text-emerald-800 font-bold bg-emerald-100/70 px-2 py-0.5 rounded-full text-xs">
                      FREE
                    </strong>
                  ) : (
                    <strong className="text-amber-950">₹{shipping}</strong>
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1 text-xs text-amber-800">
                  <span>Estimated GST (5%)</span>
                </span>
                <span className="font-bold text-amber-950">₹{tax}</span>
              </div>

              <div className="pt-4 border-t-2 border-amber-200 flex justify-between items-baseline">
                <div>
                  <span className="text-lg font-black text-amber-950 font-heading block">
                    Total Amount
                  </span>
                  <span className="text-[11px] text-amber-700 font-semibold">
                    Inclusive of all taxes
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-amber-950 font-heading">
                    ₹{total}
                  </span>
                </div>
              </div>
            </div>

            {/* Promo Code Input Box */}
            <div className="pt-2 border-t border-amber-200/80 space-y-2">
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                  placeholder="Enter Promo Code"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white border border-amber-300 text-amber-950 font-bold text-xs uppercase placeholder:normal-case placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  disabled={!inputCoupon.trim() || couponLoading}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-40 text-white font-black text-xs uppercase rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {couponLoading ? (
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : null}
                  <span>{couponLoading ? 'Applying...' : 'Apply'}</span>
                </button>
              </form>

              {couponError && (
                <p className="text-xs text-red-600 font-semibold">
                  ⚠️ {couponError}
                </p>
              )}

              {/* Quick Coupon Chips or No Promo Code Available Notice */}
              <div className="pt-1.5">
                {loadingCoupons ? (
                  <div className="text-[11px] text-amber-800/70 flex items-center gap-1.5 font-medium py-1">
                    <span className="w-3 h-3 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></span>
                    <span>Checking available vouchers...</span>
                  </div>
                ) : availableCoupons.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {availableCoupons.map((c) => (
                      <button
                        key={c.id || c.code}
                        type="button"
                        onClick={() => {
                          setInputCoupon(c.code);
                          applyCoupon(c.code);
                        }}
                        className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg bg-amber-100/90 hover:bg-amber-200 border border-amber-300 text-amber-950 transition-all shadow-2xs hover:scale-102 cursor-pointer flex items-center gap-1.5"
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
                ) : (
                  <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/90 text-xs text-amber-900/80 flex items-center gap-2 font-medium">
                    <span className="text-sm">🏷️</span>
                    <span>No promo code available at the moment</span>
                  </div>
                )}
              </div>
            </div>

            {/* Checkout Action Button */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleProceedToCheckout}
                disabled={items.length === 0 || !isValidForCheckout || actionLoading}
                className="btn-honey-primary w-full py-4 text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xl disabled:opacity-50 hover:scale-[1.02]"
              >
                <span>🔒</span>
                <span>Proceed to Checkout</span>
                <span>(₹{total})</span>
              </button>

              {/* Trust Badges */}
              <div className="pt-2 grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-amber-900/80">
                <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-200">
                  <span className="block text-base">🛡️</span>
                  <span>100% Purity</span>
                </div>
                <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-200">
                  <span className="block text-base">⚡</span>
                  <span>Fast Delivery</span>
                </div>
                <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-200">
                  <span className="block text-base">💳</span>
                  <span>Razorpay Safe</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Checkout Modal when user proceeds */}
      {isCheckoutModalOpen && (
        <OrderModal
          isCartCheckout={true}
          onClose={() => setIsCheckoutModalOpen(false)}
        />
      )}

    </div>
  );
};

export default CartPage;
