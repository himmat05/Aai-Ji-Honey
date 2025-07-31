import React, { useState } from 'react';
import { toast } from 'react-toastify';

const Form = ({ product, onClose }) => {

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

    const basePrice = product.price * formData.quantity; // ₹495 × qty
    const razorpayFee = basePrice * 0.0199;
    const gstOnFee = razorpayFee * 0.18;
    const surcharge = razorpayFee + gstOnFee;
    const deliverycharges = basePrice < 990 ? 100 : 0;
    const amount = Math.round((basePrice + surcharge + deliverycharges) * 100); // paise

    try {
      // Step 1: Create Razorpay order on backend
      // const orderRes = await fetch('http://localhost:5000/create-order', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ amount })
      // });
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
        key: 'rzp_test_vVLbAN1ObrVAwT', // Replace with your live key
        amount,
        currency: 'INR',
        name: 'Aai-Ji Honey',
        description: `Purchase of ${product.name}`,
        order_id: orderData.order.id, // Use the order ID from backend
        handler: async (response) => {
          // Step 2: Submit form with payment ID to backend
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

          // const saveRes = await fetch('http://localhost:5000/orders', {
          //   method: 'POST',
          //   headers: { 'Content-Type': 'application/json' },
          //   body: JSON.stringify(finalOrder), // ⬅️ also fix: should send finalOrder not orderData
          // });
          const saveRes = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(finalOrder)
          });

          if (saveRes.ok) {
            toast.success("✅ Order placed successfully ")
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
          color: '#24fb5d'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("❌ Could not connect to server");
    }
  };

  const basePrice = product.price * formData.quantity; // ₹495 × qty
  const razorpayFee = basePrice * 0.0199;
  const gstOnFee = razorpayFee * 0.18;
  const surcharge = razorpayFee + gstOnFee;
  const deliverycharges = basePrice < 990 ? 100 : 0;
  const amount = Math.round((basePrice + surcharge + deliverycharges)); // RS

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-tr from-yellow-100 to-yellow-300">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Item : {product.name}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="name" onChange={handleChange} value={formData.name} placeholder="Your Name" required className="w-full border p-2 rounded" />
          <input name="mobile" onChange={handleChange} value={formData.mobile} placeholder="Mobile" required className="w-full border p-2 rounded" />
          <input name="email" onChange={handleChange} value={formData.email} placeholder="Email" required type="email" className="w-full border p-2 rounded" />
          <textarea name="address" onChange={handleChange} value={formData.address} placeholder="Address" required className="w-full border p-2 rounded" />
          <input type="number" name="quantity" onChange={handleChange} value={formData.quantity} min="1" required className="w-full border p-2 rounded" placeholder="Quantity" />
          <div>
            <p>Actual price : {basePrice}</p>
            <p>Platform fee : {surcharge}</p>
            <p>Delivery : {deliverycharges}</p>
            <p>Total : {amount}</p>
          </div>
          <div className="flex justify-between">
            <button type="submit" className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 cursor-pointer">Pay & Submit</button>
            <button type="button" onClick={onClose} className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 cursor-pointer">Cancel</button>
          </div>
          <div className='text-red-600'>Notice: Please enter detailed address (Include PIN Code)</div>
          <div className='text-red-600'>Notice: ₹ 100 deliverycharges if Actualprice less than 990</div>
        </form>
      </div>
    </div>
  );
};

export default Form;