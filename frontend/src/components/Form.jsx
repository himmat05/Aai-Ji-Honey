// import React, { useState } from 'react';
// import { toast } from 'react-toastify';

// const Form = ({ product, onClose }) => {

//   const [formData, setFormData] = useState({
//     name: '',
//     mobile: '',
//     email: '',
//     address: '',
//     quantity: 1,
//   });

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const basePrice = product.price * formData.quantity; // ₹495 × qty
//     const razorpayFee = basePrice * 0.0199;
//     const gstOnFee = razorpayFee * 0.18;
//     const surcharge = razorpayFee + gstOnFee;
//     const deliverycharges = basePrice < 990 ? 100 : 0;
//     const amount = Math.round((basePrice + surcharge + deliverycharges) * 100); // paise

//     try {
//       const orderRes = await fetch(`${import.meta.env.VITE_API_URL}/create-order`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ amount })
//       });

//       const orderData = await orderRes.json();

//       if (!orderData || !orderData.order || !orderData.order.id) {
//         alert("Failed to initiate payment");
//         return;
//       }

//       const options = {
//         key:process.env.REACT_APP_RAZORPAY_KEY_ID, // Replace with your live key
//         amount,
//         currency: 'INR',
//         name: 'Aai-Ji Honey',
//         description: `Purchase of ${product.name}`,
//         order_id: orderData.order.id, // Use the order ID from backend
//         handler: async (response) => {
//           // Step 2: Submit form with payment ID to backend
//           const finalOrder = {
//             ...formData,
//             quantity: parseInt(formData.quantity),
//             product: {
//               name: product.name,
//               price: product.price,
//               image: product.image,
//             },
//             paymentId: response.razorpay_payment_id,
//           };

//           const saveRes = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(finalOrder)
//           });

//           if (saveRes.ok) {
//             toast.success("✅ Order placed successfully ")
//             onClose();
//           } else {
//             alert("❌ Failed to save order");
//           }

//         },
//         prefill: {
//           name: formData.name,
//           email: formData.email,
//           contact: formData.mobile,
//           address: formData.address
//         },
//         theme: {
//           color: '#24fb5d'
//         }
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       console.error(err);
//       alert("❌ Could not connect to server");
//     }
//   };

//   const basePrice = product.price * formData.quantity; // ₹495 × qty
//   const razorpayFee = basePrice * 0.0199;
//   const gstOnFee = razorpayFee * 0.18;
//   const surcharge = razorpayFee + gstOnFee;
//   const deliverycharges = basePrice < 990 ? 100 : 0;
//   const amount = Math.round((basePrice + surcharge + deliverycharges)); // RS

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-tr from-yellow-100 to-yellow-300">
//       <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
//         <h2 className="text-lg font-bold mb-4">Item : {product.name}</h2>
//         <form onSubmit={handleSubmit} className="space-y-3">
//           <input name="name" onChange={handleChange} value={formData.name} placeholder="Your Name" required className="w-full border p-2 rounded" />
//           <input name="mobile" onChange={handleChange} value={formData.mobile} placeholder="Mobile" required className="w-full border p-2 rounded" />
//           <input name="email" onChange={handleChange} value={formData.email} placeholder="Email" required type="email" className="w-full border p-2 rounded" />
//           <textarea name="address" onChange={handleChange} value={formData.address} placeholder="Address" required className="w-full border p-2 rounded" />
//           <input type="number" name="quantity" onChange={handleChange} value={formData.quantity} min="1" required className="w-full border p-2 rounded" placeholder="Quantity" />
//           <div>
//             <p>Actual price : {basePrice}</p>
//             <p>Platform fee : {surcharge}</p>
//             <p>Delivery : {deliverycharges}</p>
//             <p>Total : {amount}</p>
//           </div>
//           <div className="flex justify-between">
//             <button type="submit" className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 cursor-pointer">Pay & Submit</button>
//             <button type="button" onClick={onClose} className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 cursor-pointer">Cancel</button>
//           </div>
//           <div className='text-red-600'>Notice: Please enter detailed address (Include PIN Code)</div>
//           <div className='text-red-600'>Notice: ₹ 100 deliverycharges if Actualprice less than 990</div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Form;


// import React, { useState } from 'react';
// import { toast } from 'react-toastify';

// const Form = ({ product, onClose }) => {

//   const [formData, setFormData] = useState({
//     name: '',
//     mobile: '',
//     email: '',
//     address: '',
//     quantity: 1,
//   });

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const basePrice = product.price * formData.quantity; // ₹495 × qty
//     const razorpayFee = basePrice * 0.0199;
//     const gstOnFee = razorpayFee * 0.18;
//     const surcharge = razorpayFee + gstOnFee;
//     const deliverycharges = basePrice < 990 ? 100 : 0;
//     const amount = Math.round((basePrice + surcharge + deliverycharges) * 100); // paise

//     try {
//       const orderRes = await fetch(`${import.meta.env.VITE_API_URL}/create-order`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ amount })
//       });

//       const orderData = await orderRes.json();

//       if (!orderData || !orderData.order || !orderData.order.id) {
//         alert("Failed to initiate payment");
//         return;
//       }

//       const options = {
//         key: 'rzp_live_RwJfWahqgcNYJS',
//         amount,
//         currency: 'INR',
//         name: 'Aai-Ji Honey',
//         description: `Purchase of ${product.name}`,
//         order_id: orderData.order.id,
//         handler: async (response) => {
//           const finalOrder = {
//             ...formData,
//             quantity: parseInt(formData.quantity),
//             product: {
//               name: product.name,
//               price: product.price,
//               image: product.image,
//             },
//             paymentId: response.razorpay_payment_id,
//           };

//           const saveRes = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(finalOrder)
//           });

//           if (saveRes.ok) {
//             toast.success("✅ Order placed successfully")
//             onClose();
//           } else {
//             alert("❌ Failed to save order");
//           }

//         },
//         prefill: {
//           name: formData.name,
//           email: formData.email,
//           contact: formData.mobile,
//           address: formData.address
//         },
//         theme: {
//           color: '#f59e0b'
//         }
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (err) {
//       console.error(err);
//       alert("❌ Could not connect to server");
//     }
//   };

//   const basePrice = product.price * formData.quantity; // ₹495 × qty
//   const razorpayFee = basePrice * 0.0199;
//   const gstOnFee = razorpayFee * 0.18;
//   const surcharge = razorpayFee + gstOnFee;
//   const deliverycharges = basePrice < 990 ? 100 : 0;
//   const amount = Math.round((basePrice + surcharge + deliverycharges)); // RS

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4 overflow-y-auto">
//       <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] my-8">
        
//         {/* Header - Sticky */}
//         <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 flex-shrink-0">
//           <h2 className="text-2xl font-bold">🍯 {product.name}</h2>
//           <p className="text-amber-100 mt-1">Complete your order</p>
//         </div>

//         {/* Form Content - Scrollable */}
//         <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          
//           {/* Personal Information */}
//           <div>
//             <label className="block text-sm font-semibold text-amber-900 mb-2">👤 Full Name</label>
//             <input 
//               name="name" 
//               onChange={handleChange} 
//               value={formData.name} 
//               placeholder="Enter your full name" 
//               required 
//               className="w-full border-2 border-amber-200 p-3 rounded-lg focus:outline-none focus:border-amber-500 transition-colors bg-white"
//             />
//           </div>

//           {/* Mobile */}
//           <div>
//             <label className="block text-sm font-semibold text-amber-900 mb-2">📱 Mobile Number</label>
//             <input 
//               name="mobile" 
//               onChange={handleChange} 
//               value={formData.mobile} 
//               placeholder="10-digit mobile number" 
//               required 
//               className="w-full border-2 border-amber-200 p-3 rounded-lg focus:outline-none focus:border-amber-500 transition-colors bg-white"
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-sm font-semibold text-amber-900 mb-2">✉️ Email</label>
//             <input 
//               name="email" 
//               onChange={handleChange} 
//               value={formData.email} 
//               placeholder="your.email@example.com" 
//               required 
//               type="email" 
//               className="w-full border-2 border-amber-200 p-3 rounded-lg focus:outline-none focus:border-amber-500 transition-colors bg-white"
//             />
//           </div>

//           {/* Address */}
//           <div>
//             <label className="block text-sm font-semibold text-amber-900 mb-2">📍 Delivery Address</label>
//             <textarea 
//               name="address" 
//               onChange={handleChange} 
//               value={formData.address} 
//               placeholder="Include street, city, PIN code..." 
//               required 
//               className="w-full border-2 border-amber-200 p-3 rounded-lg focus:outline-none focus:border-amber-500 transition-colors h-24 resize-none bg-white"
//             />
//             <p className="text-xs text-red-600 mt-1">⚠️ Please include PIN code</p>
//           </div>

//           {/* Quantity */}
//           <div>
//             <label className="block text-sm font-semibold text-amber-900 mb-2">📦 Quantity</label>
//             <input 
//               type="number" 
//               name="quantity" 
//               onChange={handleChange} 
//               value={formData.quantity} 
//               min="1" 
//               required 
//               className="w-full border-2 border-amber-200 p-3 rounded-lg focus:outline-none focus:border-amber-500 transition-colors bg-white"
//               placeholder="1"
//             />
//           </div>

//           {/* Price Breakdown */}
//           <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border-2 border-amber-200">
//             <p className="font-semibold text-amber-900 mb-3">💰 Price Breakdown</p>
//             <div className="space-y-2 text-sm text-gray-700">
//               <div className="flex justify-between">
//                 <span>Product Price:</span>
//                 <span className="font-semibold">₹{basePrice}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Platform Fee:</span>
//                 <span className="font-semibold">₹{surcharge.toFixed(2)}</span>
//               </div>
//               {deliverycharges > 0 && (
//                 <div className="flex justify-between">
//                   <span>Delivery Charge:</span>
//                   <span className="font-semibold">₹{deliverycharges}</span>
//                 </div>
//               )}
//               <div className="border-t-2 border-amber-200 pt-2 mt-2 flex justify-between font-bold text-amber-900">
//                 <span>Total Amount:</span>
//                 <span className="text-lg">₹{amount}</span>
//               </div>
//             </div>
//           </div>

//           {/* Info Notes */}
//           <div className="space-y-2 text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
//             <p>⚠️ Please enter detailed address (Include PIN Code)</p>
//             <p>⚠️ ₹100 delivery charges upto 1kG buy</p>
//           </div>
//         </form>

//         {/* Sticky Button Section - Fixed at Bottom */}
//         <div className="p-6 border-t-2 border-amber-200 bg-white flex-shrink-0 space-y-3">
//           <div className="flex justify-between gap-3">
//             <button 
//               type="submit" 
//               onClick={handleSubmit}
//               className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
//             >
//               💳 Pay & Submit
//             </button>
//             <button 
//               type="button" 
//               onClick={onClose} 
//               className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
//             >
//               ✕ Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Form;



import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Form = ({ product, onClose }) => {

  // Customizable discount percentage
  const DISCOUNT_PERCENTAGE = 20; // Change this value to adjust discount

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    quantity: 1,
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const originalPrice = product.price * formData.quantity;
    const discountAmount = originalPrice * (DISCOUNT_PERCENTAGE / 100);
    const basePrice = originalPrice - discountAmount; // Discounted price
    
    const razorpayFee = basePrice * 0.0199;
    const gstOnFee = razorpayFee * 0.18;
    const surcharge = razorpayFee + gstOnFee;
    const deliverycharges = basePrice < 990 ? 0 : 0;
    const amount = Math.round((basePrice + surcharge + deliverycharges) * 100); // paise

    try {
      const orderRes = await fetch(`${import.meta.env.VITE_API_URL}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });

      const orderData = await orderRes.json();

      if (!orderData || !orderData.order || !orderData.order.id) {
        alert("Failed to initiate payment");
        return;
      }

      const options = {
        key: 'rzp_live_RwJfWahqgcNYJS',
        amount,
        currency: 'INR',
        name: 'Aai-Ji Honey',
        description: `Purchase of ${product.name}`,
        order_id: orderData.order.id,
        handler: async (response) => {
          const finalOrder = {
            ...formData,
            quantity: parseInt(formData.quantity),
            product: {
              name: product.name,
              price: product.price,
              image: product.image,
            },
            paymentId: response.razorpay_payment_id,
          };

          const saveRes = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalOrder)
          });

          if (saveRes.ok) {
            toast.success("✅ Order placed successfully")
            onClose();
          } else {
            alert("❌ Failed to save order");
          }

        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.mobile,
          address: formData.address
        },
        theme: {
          color: '#f59e0b'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("❌ Could not connect to server");
    }
  };

  // Calculate prices for display
  const originalPrice = product.price * formData.quantity;
  const discountAmount = originalPrice * (DISCOUNT_PERCENTAGE / 100);
  const basePrice = originalPrice - discountAmount; // Discounted price
  
  const razorpayFee = basePrice * 0.0199;
  const gstOnFee = razorpayFee * 0.18;
  const surcharge = razorpayFee + gstOnFee;
  const deliverycharges = basePrice < 990 ? 0 : 0;
  const amount = Math.round((basePrice + surcharge + deliverycharges)); // RS

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] my-8">
        
        {/* Header - Sticky */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 flex-shrink-0">
          <h2 className="text-2xl font-bold">🍯 {product.name}</h2>
          <p className="text-amber-100 mt-1">Complete your order</p>
          {DISCOUNT_PERCENTAGE > 0 && (
            <div className="mt-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 inline-block">
              <span className="text-sm font-bold">🎉 {DISCOUNT_PERCENTAGE}% OFF Applied!</span>
            </div>
          )}
        </div>

        {/* Form Content - Scrollable */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          
          {/* Personal Information */}
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-2">👤 Full Name</label>
            <input 
              name="name" 
              onChange={handleChange} 
              value={formData.name} 
              placeholder="Enter your full name" 
              required 
              className="w-full border-2 border-amber-200 p-3 rounded-lg focus:outline-none focus:border-amber-500 transition-colors bg-white"
            />
          </div>

          {/* Mobile */}
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-2">📱 Mobile Number</label>
            <input 
              name="mobile" 
              onChange={handleChange} 
              value={formData.mobile} 
              placeholder="10-digit mobile number" 
              required 
              className="w-full border-2 border-amber-200 p-3 rounded-lg focus:outline-none focus:border-amber-500 transition-colors bg-white"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-2">✉️ Email</label>
            <input 
              name="email" 
              onChange={handleChange} 
              value={formData.email} 
              placeholder="your.email@example.com" 
              required 
              type="email" 
              className="w-full border-2 border-amber-200 p-3 rounded-lg focus:outline-none focus:border-amber-500 transition-colors bg-white"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-2">📍 Delivery Address</label>
            <textarea 
              name="address" 
              onChange={handleChange} 
              value={formData.address} 
              placeholder="Include street, city, PIN code..." 
              required 
              className="w-full border-2 border-amber-200 p-3 rounded-lg focus:outline-none focus:border-amber-500 transition-colors h-24 resize-none bg-white"
            />
            <p className="text-xs text-red-600 mt-1">⚠️ Please include PIN code</p>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-semibold text-amber-900 mb-2">📦 Quantity</label>
            <input 
              type="number" 
              name="quantity" 
              onChange={handleChange} 
              value={formData.quantity} 
              min="1" 
              required 
              className="w-full border-2 border-amber-200 p-3 rounded-lg focus:outline-none focus:border-amber-500 transition-colors bg-white"
              placeholder="1"
            />
          </div>

          {/* Price Breakdown */}
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border-2 border-amber-200">
            <p className="font-semibold text-amber-900 mb-3">💰 Price Breakdown</p>
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>Original Price:</span>
                <span className="line-through text-gray-500">₹{originalPrice}</span>
              </div>
              {DISCOUNT_PERCENTAGE > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({DISCOUNT_PERCENTAGE}%):</span>
                  <span className="font-semibold">-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Product Price:</span>
                <span className="font-semibold">₹{basePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee:</span>
                <span className="font-semibold">₹{surcharge.toFixed(2)}</span>
              </div>
              {deliverycharges > 0 && (
                <div className="flex justify-between">
                  <span>Delivery Charge:</span>
                  <span className="font-semibold">₹{deliverycharges}</span>
                </div>
              )}
              <div className="border-t-2 border-amber-200 pt-2 mt-2 flex justify-between font-bold text-amber-900">
                <span>Total Amount:</span>
                <span className="text-lg">₹{amount}</span>
              </div>
              {DISCOUNT_PERCENTAGE > 0 && (
                <div className="text-center bg-green-100 text-green-700 font-semibold py-2 px-3 rounded-lg mt-2">
                  🎉 You saved ₹{discountAmount.toFixed(2)}!
                </div>
              )}
            </div>
          </div>

          {/* Info Notes */}
          <div className="space-y-2 text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
            <p>⚠️ Please enter detailed address (Include PIN Code)</p>
            <p>⚠️ ₹50 delivery charges upto 2kG buy</p>
          </div>
        </form>

        {/* Sticky Button Section - Fixed at Bottom */}
        <div className="p-6 border-t-2 border-amber-200 bg-white flex-shrink-0 space-y-3">
          <div className="flex justify-between gap-3">
            <button 
              type="submit" 
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              💳 Pay & Submit
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              ✕ Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;