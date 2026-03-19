// import React, { useEffect, useState } from 'react';
// import Form from './Form';
// import HoneyBeeBackground from './HoneyBeeBackground';

// const Product = () => {
//   const [products, setProducts] = useState([]);
//   const [selectedProduct, setSelectedProduct] = useState(null);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const res = await fetch(`${import.meta.env.VITE_API_URL}/products`);
//       const data = await res.json();
//       setProducts(data);
//     };

//     fetchProducts();
//   }, []);

//   const closeForm = () => {
//     setSelectedProduct(null);
//   };

//   return (
//     <div className='w-full min-h-[82vh] bg-gradient-to-br from-yellow-50/80 via-white/80 to-amber-100/80'>
//       <HoneyBeeBackground />
//       <div className="p-6 max-w-5xl mx-auto w-full mt-[-25px] bg-gradient-to-br from-white via-yellow-50 to-yellow-100 shadow-lg">
//         <h2 className="text-3xl font-bold text-amber-800 mb-3 mt-3">Our Products -</h2>
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 p-4 gap-6 rounded-lg shadow-lg bg-gradient-to-br from-white via-yellow-100 to-yellow-200">
//           {products.map((product) => (
//             <div
//               key={product._id}
//               className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-3xl shadow-md p-4 border border-amber-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-[480px] max-w-sm"
//             >
//               <div className="h-[71%] flex items-center justify-center bg-white rounded-xl border border-amber-100">
//                 <img
//                   src={product.image || '/placeholder.jpg'}
//                   alt={product.name}
//                   className="w-full h-78 rounded-xl"
//                 />

//               </div>

//               {/* 📦 Product Info Section */}
//               <div className="h-[30%] mt-3 flex flex-col justify-between">
//                 <div className="overflow-y-auto max-h-[100px]">
//                   <h3 className="text-lg font-bold text-amber-800">{product.name}</h3>
//                   <p className="text-base font-semibold text-gray-800">₹{product.price}</p>
//                   {/* <p className="text-sm text-gray-700">{product.description}</p> */}
//                 </div>

//                 {/* 🛒 Buy Now Button */}
//                 <button
//                   onClick={() => setSelectedProduct(product)}
//                   className="mt-2 w-full bg-amber-500 hover:cursor-pointer hover:bg-amber-600 text-white font-semibold py-2 rounded-full transition duration-200 shadow hover:shadow-lg"
//                 >
//                   🛒 Buy Now
//                 </button>
//               </div>
//             </div>
//           ))}

//         </div>
//         {selectedProduct && (
//           <Form
//             product={selectedProduct}
//             onClose={() => setSelectedProduct(null)}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default Product;

import React, { useEffect, useState } from 'react';
import Form from './Form';
import HoneyBeeBackground from './HoneyBeeBackground';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/products`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const closeForm = () => {
    setSelectedProduct(null);
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className={`
      relative z-20 min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50
      flex items-center justify-center
    `}>
      <div className="w-full max-w-7xl px-4">
        {/* Header Loading Animation */}
        <div className={`
          text-center mb-16 transition-all duration-1000
          ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        `}>
          <div className="h-12 w-64 bg-gradient-to-r from-amber-200 to-yellow-200 rounded-lg mx-auto mb-4 animate-pulse"></div>
          <div className="h-6 w-96 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-lg mx-auto mb-8 animate-pulse"></div>
        </div>

        {/* Grid of Loading Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className={`
                bg-white rounded-3xl shadow-lg overflow-hidden border-2 border-amber-100
                transition-all duration-500
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
              `}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              {/* Image Skeleton */}
              <div className="h-72 bg-gradient-to-r from-amber-100 via-yellow-100 to-orange-100 animate-shimmer relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-slide"></div>
              </div>

              {/* Content Skeleton */}
              <div className="p-6 space-y-4">
                <div className="h-8 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-lg animate-pulse"></div>
                <div className="h-4 w-32 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg animate-pulse"></div>

                {/* Price Skeleton */}
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 space-y-3">
                  <div className="h-4 w-16 bg-amber-100 rounded animate-pulse"></div>
                  <div className="flex gap-2">
                    <div className="h-8 w-20 bg-amber-200 rounded animate-pulse"></div>
                    <div className="h-8 w-20 bg-yellow-100 rounded animate-pulse"></div>
                  </div>
                </div>

                {/* Features Skeleton */}
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>

                {/* Button Skeleton */}
                <div className="h-12 bg-gradient-to-r from-amber-300 to-orange-300 rounded-xl animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Loading Message with Animation */}
        <div className="text-center mt-16">
          <div className="inline-block mb-6">
            <div className="text-6xl animate-bounce" style={{ animationDelay: '0s' }}>🍯</div>
          </div>
          <p className="text-2xl font-bold text-amber-900 mb-2">Collecting the Finest Honey</p>
          <p className="text-lg text-amber-700 mb-8">Please wait while we gather our premium selection...</p>

          {/* Progress Bar Animation */}
          <div className="w-full max-w-md h-2 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 rounded-full animate-progress"></div>
          </div>

          {/* Decorative Bees Animation */}
          <div className="flex justify-center items-center gap-8 mt-12">
            <div className="text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>🐝</div>
            <div className="text-4xl animate-bounce" style={{ animationDelay: '0.4s' }}>🐝</div>
            <div className="text-4xl animate-bounce" style={{ animationDelay: '0.6s' }}>🐝</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 relative overflow-hidden'>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 opacity-20">
        <div className="absolute top-10 left-20 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <HoneyBeeBackground />

      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div className="relative z-10 pt-8 pb-16 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section with Animation */}
            <div className={`
              text-center mb-16 transition-all duration-1000
              ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            `}>
              <div className="mb-6 inline-block">
                <span className="inline-block px-6 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full text-amber-800 font-semibold text-sm">
                  ✨ Premium Collection
                </span>
              </div>

              <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 mb-4 leading-tight">
                Our Premium Collection
              </h1>

              <p className="text-xl md:text-2xl text-amber-700 mb-8 max-w-3xl mx-auto">
                Handpicked honey varieties to sweeten every moment of your life
              </p>

              {/* Decorative Divider */}
              <div className="flex justify-center items-center gap-4 mb-8">
                <div className="h-1 w-12 bg-gradient-to-r from-transparent to-amber-500 rounded-full"></div>
                <div className="h-1 w-24 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 rounded-full animate-pulse"></div>
                <div className="h-1 w-12 bg-gradient-to-r from-amber-500 to-transparent rounded-full"></div>
              </div>
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
              <div className={`
                text-center py-20 transition-all duration-1000
                ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
              `}>
                <p className="text-3xl text-amber-800 font-semibold mb-4">🍯</p>
                <p className="text-2xl text-amber-800 font-semibold">No products available yet</p>
                <p className="text-amber-700 mt-2">Please check back soon for our premium collection</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product, idx) => {
                  const discountPercentage = product.offer || product.discountPercentage || product.discount || 0;
                  const originalPrice = product.price;
                  const discountedPrice = (originalPrice * (1 - discountPercentage / 100)).toFixed(0);
                  const isHovered = hoveredCard === product._id;

                  return (
                    <div
                      key={product._id}
                      className={`
                        relative group bg-white rounded-3xl shadow-lg overflow-hidden
                        border-2 border-amber-100
                        transition-all duration-500 ease-out
                        ${isHovered ? 'shadow-2xl scale-105 -translate-y-4' : 'hover:shadow-xl'}
                        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                        transform
                      `}
                      style={{ transitionDelay: isVisible ? `${200 + idx * 100}ms` : '0ms' }}
                      onMouseEnter={() => setHoveredCard(product._id)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      {/* Animated Glow Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white via-amber-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                      {/* Image Container */}
                      <div className="relative h-80 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 overflow-hidden">
                        {/* Decorative background pattern */}
                        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500">
                          <div className="absolute top-4 right-4 text-6xl opacity-30">🐝</div>
                          <div className="absolute bottom-4 left-4 text-5xl opacity-20">🌻</div>
                        </div>

                        <img
                          src={product.image || '/placeholder.jpg'}
                          alt={product.name}
                          className={`
                            w-full h-full object-contain p-4
                            transition-all duration-500
                            ${isHovered ? 'scale-105' : 'scale-100'}
                          `}
                        />

                        {/* Discount Badge */}
                        {discountPercentage > 0 && (
                          <div className={`
                            absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500
                            text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg
                            transition-all duration-500
                            ${isHovered ? 'scale-110 shadow-2xl' : 'scale-100'}
                            transform
                          `}>
                            <span className="inline-block animate-bounce" style={{ animationDelay: '0s' }}>🎉</span>
                            <span className="ml-2">{discountPercentage}% OFF</span>
                          </div>
                        )}

                        {/* Premium Badge */}
                        <div className={`
                          absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500
                          text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg
                          transition-all duration-500
                          ${isHovered ? 'rotate-12 shadow-2xl' : 'rotate-0'}
                          transform
                        `}>
                          🔥 Premium
                        </div>

                        {/* Hover Glow Effect */}
                        <div className={`
                          absolute inset-0 bg-gradient-to-br from-amber-400/0 to-orange-400/0
                          transition-all duration-500 pointer-events-none
                          ${isHovered ? 'from-amber-400/20 to-orange-400/20' : ''}
                        `}></div>
                      </div>

                      {/* Content Container */}
                      <div className="p-6 relative z-10">
                        {/* Title */}
                        <h3 className={`
                          text-2xl font-bold mb-2 transition-all duration-500
                          ${isHovered 
                            ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600' 
                            : 'text-amber-900'
                          }
                        `}>
                          {product.name}
                        </h3>

                        {/* Subtitle */}
                        <p className={`
                          text-sm mb-4 transition-all duration-500
                          ${isHovered ? 'text-amber-700 font-semibold' : 'text-gray-600'}
                        `}>
                          🍯 Pure & Natural Honey
                        </p>

                        {/* Divider */}
                        <div className={`
                          h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-4
                          transition-all duration-500
                          ${isHovered ? 'h-1 shadow-lg' : 'h-0.5'}
                        `}></div>

                        {/* Price Section */}
                        <div className={`
                          bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-4 mb-6
                          border-2 border-amber-200 transition-all duration-500
                          ${isHovered ? 'border-amber-400 shadow-lg' : ''}
                          transform
                        `}>
                          <p className="text-gray-600 text-xs mb-1 font-semibold">SPECIAL PRICE</p>

                          <div className="flex items-center gap-3 mb-2">
                            <p className={`
                              transition-all duration-500
                              ${isHovered ? 'text-4xl' : 'text-3xl'}
                              font-bold text-amber-900
                            `}>
                              ₹{discountedPrice}
                            </p>
                            {discountPercentage > 0 && (
                              <p className="text-lg text-gray-500 line-through">
                                ₹{originalPrice}
                              </p>
                            )}
                          </div>

                          {discountPercentage > 0 && (
                            <p className="text-green-600 text-sm font-bold">
                              💚 Save ₹{(originalPrice - discountedPrice).toFixed(0)}!
                            </p>
                          )}
                        </div>

                        {/* Features with Checkmarks */}
                        <div className="space-y-2 mb-6">
                          <div className={`
                            flex items-center gap-2 text-sm transition-all duration-300
                            ${isHovered ? 'translate-x-2 text-amber-700' : 'text-gray-700'}
                          `}>
                            <span className="text-green-600 font-bold">✓</span>
                            <span>100% Organic & Pure</span>
                          </div>
                          <div className={`
                            flex items-center gap-2 text-sm transition-all duration-300
                            ${isHovered ? 'translate-x-2 text-amber-700' : 'text-gray-700'}
                          `}
                            style={{ transitionDelay: '50ms' }}
                          >
                            <span className="text-green-600 font-bold">✓</span>
                            <span>Hand-Harvested</span>
                          </div>
                          <div className={`
                            flex items-center gap-2 text-sm transition-all duration-300
                            ${isHovered ? 'translate-x-2 text-amber-700' : 'text-gray-700'}
                          `}
                            style={{ transitionDelay: '100ms' }}
                          >
                            <span className="text-green-600 font-bold">✓</span>
                            <span>No Preservatives</span>
                          </div>
                        </div>

                        {/* Buy Button with Enhanced Effects */}
                        <button
                          onClick={() => setSelectedProduct(product)}
                          className={`
                            w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500
                            hover:from-orange-600 hover:via-red-600 hover:to-amber-700
                            text-white font-bold py-3 rounded-xl
                            transition-all duration-500 shadow-lg
                            ${isHovered 
                              ? 'shadow-2xl scale-105 -translate-y-1' 
                              : 'scale-100'
                            }
                            transform relative overflow-hidden group/btn
                            flex items-center justify-center gap-2
                          `}
                        >
                          {/* Shine Effect */}
                          <div className={`
                            absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent
                            opacity-0 transition-opacity duration-500
                            ${isHovered ? 'opacity-20' : 'opacity-0'}
                          `}></div>

                          <span className={`
                            inline-block transition-all duration-300 relative z-10
                            ${isHovered ? 'scale-125 animate-bounce' : 'scale-100'}
                          `}>
                            🛒
                          </span>

                          <span className="relative z-10">Add to Cart</span>
                        </button>
                      </div>

                      {/* Corner Decorations on Hover */}
                      <div className={`
                        absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 rounded-tr-3xl
                        transition-all duration-500
                        ${isHovered ? 'border-amber-500 opacity-100' : 'opacity-0'}
                      `}></div>

                      <div className={`
                        absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 rounded-bl-3xl
                        transition-all duration-500
                        ${isHovered ? 'border-amber-500 opacity-100' : 'opacity-0'}
                      `}></div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Form Modal */}
      {selectedProduct && (
        <Form
          product={selectedProduct}
          onClose={closeForm}
        />
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }

        @keyframes slide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes progress {
          0% {
            width: 0%;
          }
          50% {
            width: 70%;
          }
          100% {
            width: 100%;
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-shimmer {
          background: linear-gradient(90deg, #fbbf24 0%, #fde047 50%, #fbbf24 100%);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }

        .animate-slide {
          animation: slide 2s infinite;
        }

        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }

        .animate-bounce {
          animation: bounce 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
        }

        /* Smooth scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(217, 119, 6, 0.1);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #d97706, #f97316);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #b45309, #ea580c);
        }
      `}</style>
    </div>
  );
};

export default Product;