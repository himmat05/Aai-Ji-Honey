import React, { useEffect, useState } from 'react';
import Form from './Form';
import HoneyBeeBackground from './HoneyBeeBackground';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      // const res = await fetch('http://localhost:5000/products');
      const res = await fetch(`${import.meta.env.VITE_API_URL}/products`);
      const data = await res.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const closeForm = () => {
    setSelectedProduct(null);
  };

  return (
    <div className='w-full bg-gradient-to-br from-yellow-50/80 via-white/80 to-amber-100/80'>
      <HoneyBeeBackground />
      <div className="p-6 max-w-5xl mx-auto w-full mt-[-25px] bg-gradient-to-br from-white via-yellow-50 to-yellow-100 shadow-lg">
        <h2 className="text-3xl font-bold text-amber-800 mb-3 mt-3">Our Products :-</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 p-4 gap-6 rounded-lg shadow-lg bg-gradient-to-br from-white via-yellow-100 to-yellow-200">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-3xl shadow-md p-4 border border-amber-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-[480px] max-w-sm"
            >
              <div className="h-[70%] flex items-center justify-center bg-white rounded-xl border border-amber-100 p-2">
                {/* <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-80 object-contain rounded"
                /> */}
                <img
                  src={product.image || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-80 object-contain rounded"
                />

              </div>

              {/* 📦 Product Info Section */}
              <div className="h-[30%] mt-3 flex flex-col justify-between">
                <div className="overflow-y-auto max-h-[100px]">
                  <h3 className="text-lg font-bold text-amber-800">{product.name}</h3>
                  <p className="text-base font-semibold text-gray-800">₹{product.price}</p>
                  {/* <p className="text-sm text-gray-700">{product.description}</p> */}
                </div>

                {/* 🛒 Buy Now Button */}
                <button
                  onClick={() => setSelectedProduct(product)}
                  className="mt-2 w-full bg-amber-500 hover:cursor-pointer hover:bg-amber-600 text-white font-semibold py-2 rounded-full transition duration-200 shadow hover:shadow-lg"
                >
                  🛒 Buy Now
                </button>
              </div>
            </div>
          ))}



        </div>
        {selectedProduct && (
          <Form
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Product;
