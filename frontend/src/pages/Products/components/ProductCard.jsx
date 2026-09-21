import React, { useState } from 'react';

const ProductCard = ({ product, onSelect }) => {
  const [showFullDesc, setShowFullDesc] = useState(false);
  const flavourName = product.flavour || 'Wild Flora Blossom';
  const descriptionText =
    product.description ||
    '100% Pure, raw unpasteurized honey harvested straight from ethical Rajasthan hives. Rich in active enzymes, natural bee pollen, and golden wellness.';

  return (
    <div className="bg-white/95 sm:bg-white/98 backdrop-blur-md rounded-3xl p-5 border-2 border-amber-200/90 hover:border-amber-400 shadow-[0_10px_25px_-5px_rgba(217,119,6,0.12)] hover:shadow-[0_20px_40px_-5px_rgba(217,119,6,0.22)] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden text-left">
      
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

      {/* Product Image Container with high-clarity background */}
      <div className="h-56 sm:h-60 relative flex items-center justify-center bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 rounded-2xl border border-amber-100/90 p-4 overflow-hidden mt-6 shadow-inner">
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/5 via-transparent to-orange-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <img
          src={product.image || '/placeholder.jpg'}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 filter drop-shadow-md"
          loading="lazy"
        />
        <span className="absolute bottom-2.5 right-2.5 bg-white/90 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md border border-amber-200/80 shadow-xs">
          Glass Jar • 500g
        </span>
      </div>

      {/* Product Info Section */}
      <div className="mt-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Subtitle / Origin */}
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-700 tracking-wider uppercase mb-1">
            <span>Desert Apiary Harvest</span>
            <span className="text-emerald-700 font-extrabold">● Lab Tested</span>
          </div>

          {/* Product Name */}
          <h3 className="text-xl font-black text-amber-950 group-hover:text-amber-700 transition-colors line-clamp-1 leading-snug font-heading">
            {product.name}
          </h3>

          {/* Description Snippet with quick details toggle */}
          <div className="mt-2 text-xs text-amber-900/80 leading-relaxed">
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
                className="text-[11px] font-bold text-amber-700 hover:text-amber-900 underline mt-0.5 inline-block focus:outline-none"
              >
                {showFullDesc ? 'Show less' : 'Read more benefits'}
              </button>
            )}
          </div>
        </div>

        {/* Pricing & Guarantee */}
        <div className="pt-2 border-t border-amber-100 flex items-baseline justify-between">
          <div>
            <span className="text-[11px] text-amber-700/80 font-bold block uppercase tracking-wider">
              Single Origin Raw
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-950 font-heading">
                ₹{product.price}
              </span>
              <span className="text-xs text-gray-400 line-through">
                ₹{Math.round(product.price * 1.25)}
              </span>
            </div>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            Free Shipping
          </span>
        </div>

        {/* Buy Now / Order Button */}
        <button
          onClick={() => onSelect(product)}
          className="btn-honey-primary w-full py-3 text-sm font-black flex items-center justify-center gap-2 shadow-lg tracking-wide uppercase transition-all duration-200 hover:scale-[1.02]"
        >
          <span>🛒</span>
          <span>Order Now / Buy</span>
        </button>
      </div>

    </div>
  );
};

export default ProductCard;
