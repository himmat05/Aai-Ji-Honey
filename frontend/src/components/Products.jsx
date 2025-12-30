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

  useEffect(() => {
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

  return (
    <div className='w-full min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50'>
      <HoneyBeeBackground />

      <div className="pt-8 pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-amber-900 mb-3">Our Premium Collection</h1>
            <p className="text-xl text-amber-700">Handpicked honey varieties to sweeten every moment</p>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="text-4xl mb-4">🍯</div>
                <p className="text-xl text-amber-900 font-semibold">Loading our sweet collection...</p>
              </div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-amber-800 font-semibold">No products available yet</p>
            </div>
          ) : (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => {
                // Customizable discount percentage (change this value as needed)
                const discountPercentage = 20; // Change to 10, 15, 25, 30, etc.

                // Calculate discounted price
                const originalPrice = product.price;
                const discountedPrice = (originalPrice * (1 - discountPercentage / 100)).toFixed(0);

                return (
                  <div
                    key={product._id}
                    className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-amber-100 group"
                  >
                    {/* Image Container */}
                    <div className="relative h-72 bg-gradient-to-br from-amber-50 to-yellow-50 overflow-hidden">
                      <img
                        src={product.image || '/placeholder.jpg'}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                      />
                      {/* Discount Badge - Top Left */}
                      {discountPercentage > 0 && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                          🎉 {discountPercentage}% OFF
                        </div>
                      )}
                      {/* Premium Badge - Top Right */}
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                        🔥 Premium
                      </div>
                    </div>
                    {/* Content Container */}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-amber-900 mb-2 break-words">
                        {product.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4">Pure & Natural Honey</p>
                      {/* Price Section */}
                      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 mb-6 border-2 border-amber-200">
                        <p className="text-gray-600 text-sm mb-1">Price</p>
                        <div className="flex items-center gap-3">
                          <p className="text-3xl font-bold text-amber-900">
                            ₹{discountedPrice}
                          </p>
                          {discountPercentage > 0 && (
                            <p className="text-lg text-gray-500 line-through">
                              ₹{originalPrice}
                            </p>
                          )}
                        </div>
                        {discountPercentage > 0 && (
                          <p className="text-green-600 text-sm font-semibold mt-1">
                            You save ₹{(originalPrice - discountedPrice).toFixed(0)}!
                          </p>
                        )}
                      </div>
                      {/* Features */}
                      <div className="space-y-2 mb-6 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                          <span>✓</span>
                          <span>100% Organic & Pure</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>✓</span>
                          <span>Hand-Harvested</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>✓</span>
                          <span>No Added Preservatives</span>
                        </div>
                      </div>
                      {/* Buy Button */}
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="hover:cursor-pointer w-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-orange-500 hover:via-red-500 hover:to-amber-600 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
                      >
                        🛒 Buy Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Order Form Modal */}
      {selectedProduct && (
        <Form
          product={selectedProduct}
          onClose={closeForm}
        />
      )}
    </div>
  );
};

export default Product;