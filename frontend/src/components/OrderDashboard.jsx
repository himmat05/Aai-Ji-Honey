// import React, { useEffect, useRef, useState } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';

// const OrderDashboard = () => {

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const countref = useRef(1);


//   const fetchOrders = async () => {
//     try {
//       const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders`);
//       setOrders(res.data);
//     } catch (err) {
//       console.error('Error fetching orders', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const markCompleted = async (id) => {
//     try {
//       await axios.patch(`${import.meta.env.VITE_API_URL}/orders/${id}`, {
//         status: 'Completed',
//       });
//       fetchOrders();
//     } catch (err) {
//       console.error('Error updating order status', err);
//     }
//   };


//   const handlePrint = (orderId) => {
//     const order = orders.find((o) => o._id === orderId);
//     if (!order) {
//       alert('Order not found!');
//       return;
//     }

//     const deliveryFee = order.product?.price * order.quantity < 990 ? 100 : 0;
//     const ptFee = (order.product?.price * order.quantity * 0.0236).toFixed(2);
//     const total = (
//       parseFloat(ptFee) +
//       deliveryFee +
//       order.product?.price * order.quantity
//     ).toFixed(2);

//     const printWindow = window.open('', '', 'width=900,height=700');
//     printWindow.document.write(`
//     <html>
//       <head>
//         <title>Print Invoice</title>
//         <style>
//           body { font-family: Arial, sans-serif; padding: 20px; }
//           table, th, td { border: 1px solid black; border-collapse: collapse; padding: 8px; }
//           .center { text-align: center; }
//           img { max-width: 100px; height: auto; }
//         </style>
//       </head>
//       <body>
//         <div>
//           <div style="background-color:#86efac; border:2px solid black; padding:2px;">
//             <div class="center">
//               <h1 class="font-size: 20px; font-family: 'Georgia', serif; font-style: italic; color: #6b4226;">
//                    Jai Shri Aai Mata Namo Namah
//               </h1>
//               <h2 class="font-size: 16px; text-decoration: underline; font-weight: bold;">
//                    Tax Invoice
//               </h2>
//             </div> 
//             <div style="display:flex; justify-content:space-around;">
//               <div>
//                 <p>GSTIN: 08HIAPS1709H1Z5</p>
//                 <p>Email: aaijihoney24@gmail.com</p>
//               </div>
//               <div>
//                 <p>Contact: +91 9610047740</p>
//                 <p>+91 9887918251</p>
//               </div>
//             </div>
//              <div class="center" style=" display: flex; align-items: center; justify-content: center; gap: 10px;">
//                <img src="Aai ji honey.jpg" alt="Logo" style="max-width: 80px; height: auto;" />
//                <h1 style="font-size: 2.5rem; margin: 0;">Aai Ji Honey</h1>
//              </div>
//             <div>
//               <strong>Head office:</strong> 426, Aai mata colony, Megakheda, Post-Pipli Ahiran, Teh-Kunwariya, Dist-Rajsamand, Rajasthan, PIN-313327, India.
//               <div class="center"><strong>(Raw Honey, Processed Honey, Herbal Honey, Edible Honey)</strong></div>
//             </div>
//           </div>

//           <div style="margin-top: 10px; border:2px solid black; background-color:#fde68a; display:flex;">
//             <div style="width:60%; border-right:2px solid black; padding-left:10px; padding-right:10px;">
//               <p><strong>Customer Details:</strong></p>
//               <p><strong>GSTIN:</strong> 08AHFPC5892E1ZC</p>
//               <p><strong>Name:</strong> ${order.name}</p>
//               <p><strong>Mobile:</strong> ${order.mobile}</p>
//               <p><strong>Email:</strong> ${order.email}</p>
//               <p><strong>Address:</strong> ${order.address}</p>
//             </div>
//             <div style="width:40%; padding-left:10px;">
//               <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
//               <p><strong>Invoice No.:</strong> ${order.invoiceNumber}</p>
//               <p><strong>Supply State:</strong> Rajasthan</p>
//               <p><strong>Supply Mode:</strong> Delivery</p>
//               <p><strong>Ordered by:</strong> MR. Bhanwar lal</p>
//             </div>
//           </div>

//           <div style="margin-top:15px;">
//             <table width="100%">
//               <thead>
//                 <tr>
//                   <th>S.No</th>
//                   <th>Description</th>
//                   <th>HSN</th>
//                   <th>Quantity</th>
//                   <th>Price ₹</th>
//                   <th>Total ₹</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 <tr>
//                   <td>1</td>
//                   <td>${order.product?.name || 'N/A'}</td>
//                   <td>0409</td>
//                   <td>${order.quantity}</td>
//                   <td>${order.product?.price}</td>
//                   <td>${order.product?.price * order.quantity}</td>
//                 </tr>
//                 <tr>
//                   <td colspan="4"></td>
//                   <td><strong>Pt fee ₹</strong></td>
//                   <td>${ptFee}</td>
//                 </tr>
//                 <tr>
//                   <td colspan="4"></td>
//                   <td><strong>Delivery ₹</strong></td>
//                   <td>${deliveryFee}</td>
//                 </tr>
//                 <tr>
//                   <td colspan="4"></td>
//                   <td><strong>Total ₹</strong></td>
//                   <td>${total}</td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>

//           <div style="margin-top:5px; display:flex; justify-content:space-between;">
//             <div>
//               <strong>Terms & Conditions:</strong>
//               <ul>
//                 <li>E & O.E</li>
//                 <li>All disputes subject to "UDAIPUR" jurisdiction only.</li>
//               </ul>
//             </div>
//             <div style="text-align:right;">
//               <img src="Signature.png" alt="Signature" />
//               <h4><strong>For - Aai Ji Honey</strong></h4>
//               <p>Authorized Signature</p>
//             </div>
//           </div>
//         </div>
//       </body>
//     </html>
//   `);

//     printWindow.document.close();
//     printWindow.onload = () => {
//       printWindow.focus();
//       printWindow.print();
//       printWindow.close();
//     };
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this order?")) return;

//     try {
//       await axios.delete(`${import.meta.env.VITE_API_URL}/api/orders/${id}`);
//       setOrders(orders.filter(order => order._id !== id)); // update UI instantly
//     } catch (err) {
//       console.error("Delete failed", err);
//       alert("Failed to delete order");
//       console.log("Deleting order:", id);
//     }
//   };

//   // Separate orders into pending and completed
//   const pendingOrders = orders.filter(order => order.status !== 'Completed');
//   const completedOrders = orders.filter(order => order.status === 'Completed');

//   const renderOrderCard = (order, showCompleteBtn = false) => (
//     <div key={order._id} className="border p-4 rounded shadow-md bg-white relative">

//       {/* Visible Info */}
//       <p><strong>Name:</strong> {order.name}</p>
//       <div className='flex'><h1 className='font-bold'>Invoice No.:</h1><h1>{order.invoiceNumber}</h1></div>
//       <p><strong>Address:</strong> {order.address}</p>
//       <p><strong>Product:</strong> {order.product?.name || 'N/A'}</p>
//       <p><strong>Price:</strong> ₹{order.product?.price || 'N/A'}</p>
//       <p><strong>Quantity:</strong> {order.quantity}</p>
//       <p><strong>Total Price:</strong> ₹{order.product?.price * order.quantity}</p>
//       <p><strong>Email:</strong> {order.email}</p>
//       <p><strong>Mobile:</strong> {order.mobile || 'N/A'}</p>
//       <p><strong>Payment ID:</strong> {order.paymentId}</p>
//       <p><strong>Ordered On:</strong> {new Date(order.createdAt).toLocaleString()}</p>
//       <p><strong>Status:</strong> {order.status || 'Pending'}</p>
//       {/* Action Buttons */}
//       <div className="flex gap-3 mt-3">
//         {showCompleteBtn && (
//           <button
//             onClick={() => markCompleted(order._id)}
//             className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
//           >
//             Mark as Completed
//           </button>
//         )}


//         <button
//           onClick={() => handlePrint(order._id)}
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer" >
//           Print Bill
//         </button>
//         {/* delete button */}
//         <button
//           onClick={() => handleDelete(order._id)}
//           className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-sm transition"
//         >
//           Delete
//         </button>
//       </div>
//     </div>
//   );


//   return (
//     <div className="m-2.5 p-4 max-w-full mx-auto w-full mt-[-15px] mb-[-6px] bg-gradient-to-br from-yellow-100 to-yellow-300 shadow-lg">
//       <h2 className="text-3xl font-bold mb-6 mt-5 text-center">Order Dashboard</h2>

//       <div className='routes  space-x-3 mb-3'>
//         <span className="bg-gradient-to-r from-amber-200 to-amber-500 hover:from-amber-400 hover:to-amber-200 text-amber-900 font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 ease-in-out">
//           <Link to="/" className="no-underline">Home</Link>
//         </span>

//         <span className="bg-gradient-to-r from-amber-200 to-amber-500 hover:from-amber-400 hover:to-amber-200 text-amber-900 font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 ease-in-out">
//           <Link to="/add-product" className="no-underline">Dashboard</Link>
//         </span>

//       </div>

//       {loading ? (
//         <p>Loading orders...</p>
//       ) : (
//         <>
//           <div className="mb-8">
//             <h3 className="text-2xl font-semibold mb-4 hover:shadow-2xl">🕒 Pending Orders</h3>
//             {pendingOrders.length === 0 ? (
//               <p>No pending orders.</p>
//             ) : (
//               <div className="space-y-4">
//                 {pendingOrders.map(order => renderOrderCard(order, true))}
//               </div>
//             )}
//           </div>

//           <div>
//             <h3 className="text-2xl font-semibold mb-4 hover:shadow-2xl">✅ Completed Orders</h3>
//             {completedOrders.length === 0 ? (
//               <p>No completed orders yet.</p>
//             ) : (
//               <div className="space-y-4">
//                 {completedOrders.map(order => renderOrderCard(order))}
//               </div>

//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default OrderDashboard;


import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const OrderDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders`);
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders', err);
      toast.error('❌ Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const markCompleted = async (id) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/orders/${id}`, {
        status: 'Completed',
      });
      toast.success('✅ Order marked as completed');
      fetchOrders();
    } catch (err) {
      console.error('Error updating order status', err);
      toast.error('❌ Failed to update order');
    }
  };

  const handlePrint = (orderId) => {
    const order = orders.find((o) => o._id === orderId);
    if (!order) {
      alert('Order not found!');
      return;
    }

    const deliveryFee = order.product?.price * order.quantity < 990 ? 100 : 0;
    const ptFee = (order.product?.price * order.quantity * 0.0236).toFixed(2);
    const total = (
      parseFloat(ptFee) +
      deliveryFee +
      order.product?.price * order.quantity
    ).toFixed(2);

    const printWindow = window.open('', '', 'width=900,height=700');
    printWindow.document.write(`
    <html>
      <head>
        <title>Print Invoice</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table, th, td { border: 1px solid black; border-collapse: collapse; padding: 8px; }
          .center { text-align: center; }
          img { max-width: 100px; height: auto; }
        </style>
      </head>
      <body>
        <div>
          <div style="background-color:#86efac; border:2px solid black; padding:2px;">
            <div class="center">
              <h1 class="font-size: 20px; font-family: 'Georgia', serif; font-style: italic; color: #6b4226;">
                   Jai Shri Aai Mata Namo Namah
              </h1>
              <h2 class="font-size: 16px; text-decoration: underline; font-weight: bold;">
                   Tax Invoice
              </h2>
            </div> 
            <div style="display:flex; justify-content:space-around;">
              <div>
                <p>GSTIN: 08HIAPS1709H1Z5</p>
                <p>Email: aaijihoney24@gmail.com</p>
              </div>
              <div>
                <p>Contact: +91 9610047740</p>
                <p>+91 9887918251</p>
              </div>
            </div>
             <div class="center" style=" display: flex; align-items: center; justify-content: center; gap: 10px;">
               <img src="Aai ji honey.jpg" alt="Logo" style="max-width: 80px; height: auto;" />
               <h1 style="font-size: 2.5rem; margin: 0;">Aai Ji Honey</h1>
             </div>
            <div>
              <strong>Head office:</strong> 426, Aai mata colony, Megakheda, Post-Pipli Ahiran, Teh-Kunwariya, Dist-Rajsamand, Rajasthan, PIN-313327, India.
              <div class="center"><strong>(Raw Honey, Processed Honey, Herbal Honey, Edible Honey)</strong></div>
            </div>
          </div>

          <div style="margin-top: 10px; border:2px solid black; background-color:#fde68a; display:flex;">
            <div style="width:60%; border-right:2px solid black; padding-left:10px; padding-right:10px;">
              <p><strong>Customer Details:</strong></p>
              <p><strong>GSTIN:</strong> 08AHFPC5892E1ZC</p>
              <p><strong>Name:</strong> ${order.name}</p>
              <p><strong>Mobile:</strong> ${order.mobile}</p>
              <p><strong>Email:</strong> ${order.email}</p>
              <p><strong>Address:</strong> ${order.address}</p>
            </div>
            <div style="width:40%; padding-left:10px;">
              <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
              <p><strong>Invoice No.:</strong> ${order.invoiceNumber}</p>
              <p><strong>Supply State:</strong> Rajasthan</p>
              <p><strong>Supply Mode:</strong> Delivery</p>
              <p><strong>Ordered by:</strong> MR. Bhanwar lal</p>
            </div>
          </div>

          <div style="margin-top:15px;">
            <table width="100%">
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Description</th>
                  <th>HSN</th>
                  <th>Quantity</th>
                  <th>Price ₹</th>
                  <th>Total ₹</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>${order.product?.name || 'N/A'}</td>
                  <td>0409</td>
                  <td>${order.quantity}</td>
                  <td>${order.product?.price}</td>
                  <td>${order.product?.price * order.quantity}</td>
                </tr>
                <tr>
                  <td colspan="4"></td>
                  <td><strong>Pt fee ₹</strong></td>
                  <td>${ptFee}</td>
                </tr>
                <tr>
                  <td colspan="4"></td>
                  <td><strong>Delivery ₹</strong></td>
                  <td>${deliveryFee}</td>
                </tr>
                <tr>
                  <td colspan="4"></td>
                  <td><strong>Total ₹</strong></td>
                  <td>${total}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style="margin-top:5px; display:flex; justify-content:space-between;">
            <div>
              <strong>Terms & Conditions:</strong>
              <ul>
                <li>E & O.E</li>
                <li>All disputes subject to "UDAIPUR" jurisdiction only.</li>
              </ul>
            </div>
            <div style="text-align:right;">
              <img src="Signature.png" alt="Signature" />
              <h4><strong>For - Aai Ji Honey</strong></h4>
              <p>Authorized Signature</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `);

    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/orders/${id}`);
      setOrders(orders.filter(order => order._id !== id));
      toast.success('✅ Order deleted successfully');
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("❌ Failed to delete order");
    }
  };

  const pendingOrders = orders.filter(order => order.status !== 'Completed');
  const completedOrders = orders.filter(order => order.status === 'Completed');

  const renderOrderCard = (order, showCompleteBtn = false) => (
    <div key={order._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-l-4 border-amber-500">
      <div className="p-6">
        
        {/* Order Header */}
        <div className="flex items-start justify-between mb-4 pb-4 border-b-2 border-amber-200">
          <div>
            <p className="text-sm text-gray-600">Order #{order.invoiceNumber}</p>
            <p className="text-2xl font-bold text-amber-900">{order.name}</p>
          </div>
          <span className={`px-4 py-2 rounded-full font-bold text-white ${order.status === 'Completed' ? 'bg-green-500' : 'bg-orange-500'}`}>
            {order.status === 'Completed' ? '✅ Completed' : '⏳ Pending'}
          </span>
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
            <p className="text-xs text-amber-700 font-semibold">Product</p>
            <p className="font-bold text-amber-900">{order.product?.name}</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
            <p className="text-xs text-amber-700 font-semibold">Price</p>
            <p className="font-bold text-amber-900">₹{order.product?.price}</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
            <p className="text-xs text-amber-700 font-semibold">Quantity</p>
            <p className="font-bold text-amber-900">×{order.quantity}</p>
          </div>
          <div className="bg-orange-100 rounded-lg p-3 border border-orange-300">
            <p className="text-xs text-orange-700 font-semibold">Total</p>
            <p className="font-bold text-orange-900">₹{order.product?.price * order.quantity}</p>
          </div>
        </div>

        {/* Contact Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
          <p className="text-sm text-gray-700 mb-2"><strong>📧 Email:</strong> {order.email}</p>
          <p className="text-sm text-gray-700 mb-2"><strong>📱 Mobile:</strong> {order.mobile}</p>
          <p className="text-sm text-gray-700"><strong>📍 Address:</strong> {order.address}</p>
        </div>

        {/* Additional Info */}
        <div className="space-y-2 text-sm text-gray-700 mb-6">
          <p><strong>Payment ID:</strong> {order.paymentId}</p>
          <p><strong>Ordered:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {showCompleteBtn && (
            <button
              onClick={() => markCompleted(order._id)}
              className="flex-1 min-w-40 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              ✅ Mark Completed
            </button>
          )}
          <button
            onClick={() => handlePrint(order._id)}
            className="flex-1 min-w-40 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-bold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            🖨️ Print Bill
          </button>
          <button
            onClick={() => handleDelete(order._id)}
            className="flex-1 min-w-40 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-4">📦 Order Dashboard</h1>
          <p className="text-amber-700">Manage all customer orders</p>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mb-8 flex-wrap">
          <Link 
            to="/" 
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            🏠 Home
          </Link>
          <Link 
            to="/add-product" 
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all"
          >
            ➕ Products
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-2xl text-amber-900 font-bold">Loading orders... 🍯</p>
          </div>
        ) : (
          <>
            {/* Pending Orders */}
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-3xl font-bold text-amber-900">⏳ Pending Orders</h2>
                <span className="bg-orange-500 text-white px-4 py-2 rounded-full font-bold">
                  {pendingOrders.length}
                </span>
              </div>

              {pendingOrders.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border-2 border-amber-200 shadow-lg">
                  <p className="text-2xl text-amber-700 font-semibold">No pending orders. Great work! 🎉</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingOrders.map(order => renderOrderCard(order, true))}
                </div>
              )}
            </div>

            {/* Completed Orders */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-3xl font-bold text-amber-900">✅ Completed Orders</h2>
                <span className="bg-green-500 text-white px-4 py-2 rounded-full font-bold">
                  {completedOrders.length}
                </span>
              </div>

              {completedOrders.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border-2 border-amber-200 shadow-lg">
                  <p className="text-2xl text-amber-700 font-semibold">No completed orders yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {completedOrders.map(order => renderOrderCard(order))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderDashboard;