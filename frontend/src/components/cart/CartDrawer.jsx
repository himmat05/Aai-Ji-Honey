import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import useAuth from '../../hooks/useAuth';

const CartDrawer = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    isDrawerOpen,
    setIsDrawerOpen,
    items,
    itemCount,
    subtotal,
    productDiscount,
    couponDiscount,
    appliedCoupon,
    shipping,
    freeShippingThreshold,
    freeShippingRemaining,
    total,
    updateQuantity,
    removeFromCart,
    actionLoading,
  } = useCart();

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, setIsDrawerOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  const freeShippingPercent = Math.min(
    100,
    Math.round(((freeShippingThreshold - freeShippingRemaining) / freeShippingThreshold) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop overlay */}
      <div
        onClick={() => setIsDrawerOpen(false)}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white/95 backdrop-blur-2xl shadow-2xl flex flex-col border-l border-amber-200">
          
          {/* Drawer Header */}
          <div className="p-5 border-b border-amber-200/80 bg-amber-50/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛒</span>
              <div>
                <h3 className="font-heading font-black text-xl text-amber-950">
                  Your Cart
                </h3>
                <p className="text-xs font-bold text-amber-700">
                  {isAuthenticated
                    ? `${itemCount} ${itemCount === 1 ? 'item' : 'items'} selected`
                    : 'Sign in to access'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsDrawerOpen(false)}
              className="w-9 h-9 rounded-full bg-white hover:bg-amber-100 border border-amber-300 text-amber-950 flex items-center justify-center text-lg font-bold transition-all shadow-xs cursor-pointer"
              aria-label="Close cart drawer"
            >
              ✕
            </button>
          </div>

          {/* Free Shipping Progress Bar (Authenticated only) */}
          {isAuthenticated && (
            <div className="px-5 py-3 bg-amber-100/50 border-b border-amber-200 text-xs">
              {freeShippingRemaining > 0 ? (
                <div className="space-y-1.5">
                  <p className="font-semibold text-amber-950 flex items-center justify-between">
                    <span>Add <strong className="text-amber-800">₹{freeShippingRemaining}</strong> more for Free Shipping</span>
                    <span className="font-bold text-[11px] text-amber-700">{freeShippingPercent}%</span>
                  </p>
                  <div className="w-full h-2 bg-amber-200/70 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${freeShippingPercent}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold">
                  <span>🎉</span>
                  <span>Congratulations! You unlocked Free Express Delivery!</span>
                </div>
              )}
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-amber-100">
            {!isAuthenticated ? (
              <div className="py-12 text-center space-y-5">
                <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-4xl shadow-inner">
                  🔐
                </div>
                <div className="space-y-1.5 px-4">
                  <h4 className="font-heading font-black text-xl text-amber-950">
                    Sign In to Access Cart
                  </h4>
                  <p className="text-xs text-amber-900/80 leading-relaxed">
                    You must be logged in to add items to your cart, save selections, and place orders.
                  </p>
                </div>
                <div className="pt-2 flex flex-col gap-2.5 px-6">
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname || '/products')}`);
                    }}
                    className="btn-honey-primary w-full py-3 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer"
                  >
                    <span>🔑</span>
                    <span>Sign In to Account</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsDrawerOpen(false);
                      navigate(`/login?mode=signup&redirect=${encodeURIComponent(window.location.pathname || '/products')}`);
                    }}
                    className="w-full py-2.5 text-xs font-bold text-amber-900 hover:text-amber-950 hover:bg-amber-100/50 rounded-xl transition-colors border border-amber-300 cursor-pointer"
                  >
                    Create Free Account
                  </button>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-4xl shadow-inner">
                  🍯
                </div>
                <div className="space-y-1">
                  <h4 className="font-heading font-black text-lg text-amber-950">
                    Your cart is empty
                  </h4>
                  <p className="text-xs text-amber-900/70 max-w-xs mx-auto">
                    Explore Rajasthan wild apiary raw honey and add fresh jars to your daily wellness routine.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    navigate('/products');
                  }}
                  className="btn-honey-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>🛍️</span>
                  <span>Explore Honey Products</span>
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.productId} className="pt-4 first:pt-0 flex gap-3 text-left">
                  {/* Thumbnail */}
                  <img
                    src={item.image || '/placeholder.jpg'}
                    alt={item.name}
                    className="w-20 h-20 rounded-xl object-contain bg-amber-50/60 border border-amber-200 p-1 flex-shrink-0"
                  />

                  {/* Info & Quantity */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="font-heading font-black text-sm text-amber-950 truncate leading-snug">
                          {item.name}
                        </h5>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-stone-400 hover:text-red-500 text-xs transition-colors p-1"
                          title="Remove item"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="text-[11px] font-bold text-amber-700">
                        {item.flavour}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Price */}
                      <div>
                        <span className="font-black text-sm text-amber-950 font-heading">
                          ₹{item.price}
                        </span>
                        {item.originalPrice > item.price && (
                          <span className="text-[10px] text-gray-400 line-through ml-1.5">
                            ₹{item.originalPrice}
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-amber-300 rounded-lg overflow-hidden bg-white shadow-xs">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 flex items-center justify-center text-amber-950 hover:bg-amber-100 active:bg-amber-200 font-black text-xs disabled:opacity-30 transition-colors cursor-pointer"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-black text-amber-950 select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="w-7 h-7 flex items-center justify-center text-amber-950 hover:bg-amber-100 active:bg-amber-200 font-black text-xs disabled:opacity-30 transition-colors cursor-pointer"
                          title={item.quantity >= item.stock ? `Max stock (${item.stock}) reached` : ''}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer with Pricing Summary & Actions */}
          {isAuthenticated && items.length > 0 && (
            <div className="p-5 border-t border-amber-200 bg-amber-50/70 space-y-3">
              <div className="space-y-1.5 text-xs text-amber-900/90 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-amber-950">₹{subtotal}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Promo ({appliedCoupon.code})</span>
                    <span>-₹{couponDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold">
                    {shipping === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shipping}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-amber-200 flex justify-between text-base font-black text-amber-950 font-heading">
                  <span>Estimated Total</span>
                  <span className="text-lg text-amber-950">₹{total}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setIsDrawerOpen(false);
                    navigate('/cart');
                  }}
                  className="btn-honey-primary w-full py-3.5 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
                >
                  <span>🛍️</span>
                  <span>View Full Cart & Checkout</span>
                  <span>→</span>
                </button>

                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="w-full py-2.5 text-xs font-bold text-amber-800 hover:text-amber-950 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
