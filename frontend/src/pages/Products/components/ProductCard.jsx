import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useCart from '../../../hooks/useCart';
import useAuth from '../../../hooks/useAuth';

const ProductCard = ({ product, onSelect }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart, buyNow, actionLoading } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const flavourName = product.flavour || 'Wild Flora Blossom';
  const descriptionText =
    product.description ||
    '100% Pure, raw unpasteurized honey harvested straight from ethical Rajasthan hives. Rich in active enzymes, natural bee pollen, and golden wellness.';

  const parsedStock = product.stock !== undefined && product.stock !== null ? parseInt(product.stock, 10) : 50;
  const availableStock = isNaN(parsedStock) ? 50 : parsedStock;
  const isOutOfStock = availableStock <= 0 || product.isActive === false;
  const isLowStock = !isOutOfStock && availableStock < 5;

  const handleProductClick = () => {
    if (isOutOfStock) {
      toast.error('Item out of stock');
    }
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (isOutOfStock) {
      toast.error('Item out of stock');
      return;
    }

    if (!isAuthenticated) {
      toast.warn('Please sign in to add items to your cart.');
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname || '/products')}`);
      return;
    }

    setIsAdding(true);
    await addToCart(product, quantity, true);
    setIsAdding(false);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (isOutOfStock) {
      toast.error('Item out of stock');
      return;
    }

    if (!isAuthenticated) {
      toast.warn('Please sign in to proceed with your order.');
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname || '/products')}`);
      return;
    }

    // Register Buy Now item in CartContext (leaving persistent cart untouched)
    const success = buyNow(product, quantity);
    // Open Checkout Modal directly
    if (success && onSelect) {
      onSelect(product, quantity);
    }
  };

  return (
    <div
      onClick={isOutOfStock ? handleProductClick : undefined}
      className={`bg-white/95 sm:bg-white/98 backdrop-blur-md rounded-3xl p-5 border-2 ${
        isOutOfStock
          ? 'border-red-200/80 bg-stone-50/90 cursor-not-allowed'
          : 'border-amber-200/90 hover:border-amber-400 shadow-[0_10px_25px_-5px_rgba(217,119,6,0.12)] hover:shadow-[0_20px_40px_-5px_rgba(217,119,6,0.22)]'
      } transition-all duration-300 flex flex-col justify-between group relative overflow-hidden text-left`}
    >
      
      {/* Top Floating Badges */}
      <div className="absolute top-6 left-6 z-10 flex flex-wrap gap-1.5 pointer-events-none">
        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 text-white text-[11px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
          <span>🌼</span>
          <span>{flavourName}</span>
        </span>
      </div>

      {/* Top Rating Badge */}
      <div className="absolute top-6 right-6 z-10 pointer-events-none">
        {product.ratingCount > 0 && product.avgRating > 0 ? (
          <span className="px-2.5 py-1 rounded-full bg-amber-50/95 text-amber-950 border border-amber-300 text-[11px] font-extrabold flex items-center gap-1 shadow-sm">
            <span>⭐</span>
            <span>
              {product.avgRating} ({product.ratingCount} {product.ratingCount === 1 ? 'review' : 'reviews'})
            </span>
          </span>
        ) : (
          <span className="px-2.5 py-1 rounded-full bg-stone-50/95 text-stone-600 border border-stone-200 text-[10px] font-semibold flex items-center gap-1 shadow-2xs">
            <span className="text-stone-400">☆</span>
            <span>No ratings yet</span>
          </span>
        )}
      </div>

      {/* Product Image Container */}
      <div className="h-56 sm:h-60 relative flex items-center justify-center bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 rounded-2xl border border-amber-100/90 p-4 overflow-hidden mt-6 shadow-inner">
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/5 via-transparent to-orange-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <img
          src={product.image || '/placeholder.jpg'}
          alt={product.name}
          className={`w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 filter drop-shadow-md ${
            isOutOfStock ? 'grayscale opacity-60' : ''
          }`}
          loading="lazy"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="bg-red-600/95 text-white font-black text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg border border-white/20 flex items-center gap-1.5">
              <span>🚫</span>
              <span>Out of Stock</span>
            </span>
          </div>
        )}
        <span className="absolute bottom-2.5 right-2.5 bg-white/90 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-200/80 shadow-xs">
          Glass Jar • 500g
        </span>
      </div>

      {/* Product Info Section */}
      <div className="mt-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Subtitle / Stock Status */}
          <div className="flex items-center justify-between text-[11px] font-bold tracking-wider uppercase mb-1">
            <span className="text-amber-700">Desert Apiary Harvest</span>
            {isOutOfStock ? (
              <span className="text-red-600 font-black flex items-center gap-1 bg-red-100/80 border border-red-300 px-2 py-0.5 rounded-md text-[10px]">
                ● Out of Stock
              </span>
            ) : isLowStock ? (
              <span className="text-amber-900 font-extrabold animate-pulse flex items-center gap-1 bg-amber-100 border border-amber-400 px-2 py-0.5 rounded-md text-[10px]">
                ⚠️ Limited Stock: Only {availableStock} left!
              </span>
            ) : (
              <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                ● In Stock ({availableStock})
              </span>
            )}
          </div>

          {/* Product Name */}
          <h3 className="text-xl font-black text-amber-950 group-hover:text-amber-700 transition-colors line-clamp-1 leading-snug font-heading">
            {product.name}
          </h3>

          {/* Description Snippet with quick details toggle */}
          <div className="mt-2 text-xs text-amber-950/80 leading-relaxed font-medium">
            <p className={showFullDesc ? 'line-clamp-none' : 'line-clamp-2'}>
              {descriptionText}
            </p>
            {descriptionText.length > 90 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFullDesc(!showFullDesc);
                }}
                className="text-[11px] font-bold text-amber-700 hover:text-amber-900 underline mt-0.5 inline-block focus:outline-none cursor-pointer"
              >
                {showFullDesc ? 'Show less' : 'Read more benefits'}
              </button>
            )}
          </div>
        </div>

        {/* Pricing & Free Shipping */}
        <div className="pt-2 border-t border-amber-100 flex items-baseline justify-between">
          <div>
            <span className="text-[11px] text-amber-700/80 font-bold block uppercase tracking-wider">
              Single Origin Raw
            </span>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-2xl font-black text-amber-950 font-heading">
                ₹{product.price}
              </span>
              {product.originalPrice && Number(product.originalPrice) > Number(product.price) && (
                <>
                  <span className="text-xs text-stone-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-black bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    {Math.round(((Number(product.originalPrice) - Number(product.price)) / Number(product.originalPrice)) * 100)}% OFF
                  </span>
                </>
              )}
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full whitespace-nowrap">
            Free Delivery &gt; ₹999
          </span>
        </div>

        {/* Quantity Controls & Dual Action Buttons */}
        <div className="pt-2 space-y-2">
          {/* Quantity Selector */}
          <div className="flex items-center justify-between bg-amber-50/70 p-1.5 rounded-2xl border border-amber-200">
            <span className="text-xs font-bold text-amber-900 pl-2">Quantity:</span>
            <div className="flex items-center bg-white rounded-xl border border-amber-300 shadow-xs overflow-hidden">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (isOutOfStock) {
                    toast.error('Item out of stock');
                    return;
                  }
                  setQuantity((prev) => Math.max(1, prev - 1));
                }}
                disabled={isOutOfStock || quantity <= 1}
                className="w-8 h-8 flex items-center justify-center text-amber-950 hover:bg-amber-100 font-black text-sm disabled:opacity-30 transition-colors"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-8 text-center text-xs font-black text-amber-950">
                {isOutOfStock ? 0 : quantity}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (isOutOfStock) {
                    toast.error('Item out of stock');
                    return;
                  }
                  setQuantity((prev) => Math.min(availableStock, prev + 1));
                }}
                disabled={isOutOfStock || quantity >= availableStock}
                className="w-8 h-8 flex items-center justify-center text-amber-950 hover:bg-amber-100 font-black text-sm disabled:opacity-30 transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          {isOutOfStock ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toast.error('Item out of stock');
              }}
              className="w-full py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider bg-stone-200 hover:bg-red-50 hover:border-red-300 hover:text-red-700 border-2 border-stone-300 text-stone-600 shadow-xs cursor-pointer flex items-center justify-center gap-2 transition-all duration-200"
            >
              <span>🚫</span>
              <span>Item Out of Stock</span>
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdding || actionLoading}
                className="px-3 py-3 rounded-2xl font-black text-xs uppercase tracking-wider bg-white hover:bg-amber-50 border-2 border-amber-400 text-amber-950 shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer"
              >
                {isAdding ? (
                  <span className="animate-spin text-sm">⏳</span>
                ) : (
                  <span>🛒</span>
                )}
                <span>{isAdding ? 'Adding...' : 'Add to Cart'}</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={actionLoading}
                className="btn-honey-primary py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.02] disabled:opacity-40 cursor-pointer"
              >
                <span>⚡</span>
                <span>Buy Now</span>
              </button>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default ProductCard;
