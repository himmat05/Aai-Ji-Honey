import React from 'react';
import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart';

const CartBadge = ({ isMobile = false }) => {
  const { itemCount, setIsDrawerOpen } = useCart();

  return (
    <button
      type="button"
      onClick={() => setIsDrawerOpen(true)}
      title="View Shopping Cart"
      aria-label={`Shopping Cart with ${itemCount} items`}
      className={`relative inline-flex items-center justify-center rounded-full transition-all duration-300 group cursor-pointer ${
        isMobile
          ? 'w-10 h-10 bg-amber-100/90 hover:bg-amber-200 border border-amber-300 text-amber-950 text-lg shadow-xs'
          : 'px-3.5 py-2 bg-white/95 hover:bg-amber-50 border border-amber-300/80 shadow-xs hover:shadow-md text-amber-950 text-xs font-bold'
      }`}
    >
      <span className="text-base group-hover:scale-110 transition-transform">
        🛒
      </span>
      {!isMobile && (
        <span className="ml-1.5 hidden sm:inline tracking-wide font-heading">
          Cart
        </span>
      )}

      {itemCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md animate-[bounce_0.6s_ease-out_1]">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
};

export default CartBadge;
