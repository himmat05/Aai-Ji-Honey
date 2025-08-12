import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const OrderDashboard = () => {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const countref = useRef(1);


  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders`);
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders', err);
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
      fetchOrders(); // refresh the order list
    } catch (err) {
      console.error('Error updating order status', err);
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
            <div style="display:flex; justify-content:space-around; margin-top:10px;">
              <div>
                <p>GSTIN: 08HIAPS1709H1Z5</p>
                <p>Email: aaijihoney24@gmail.com</p>
              </div>
              <div>
                <p>Contact: +91 9610047740</p>
                <p>+91 9887918251</p>
              </div>
            </div>
             <div class="center" style="margin: 10px 0; display: flex; align-items: center; justify-content: center; gap: 10px;">
               <img src="Aai ji honey.jpg" alt="Logo" style="max-width: 80px; height: auto;" />
               <h1 style="font-size: 2.5rem; margin: 0;">Aai Ji Honey</h1>
             </div>
            <div>
              <strong>Head office:</strong> 426, Aai mata colony, Megakheda, Post-Pipli Ahiran, Teh-Kunwariya, Dist-Rajsamand, Rajasthan, PIN-313327, India.
              <div class="center"><strong>(Raw Honey, Processed Honey, Herbal Honey, Edible Honey)</strong></div>
            </div>
          </div>

          <div style="margin-top: 10px; border:2px solid black; background-color:#fde68a; display:flex;">
            <div style="width:60%; border-right:2px solid black; padding-right:10px;">
              <p><strong>Customer Details:</strong></p>
              <p><strong>GSTIN:</strong> 08AHFPC5892E1ZC</p>
              <p><strong>Name:</strong> ${order.name}</p>
              <p><strong>Mobile:</strong> ${order.mobile}</p>
              <p><strong>Email:</strong> ${order.email}</p>
              <p><strong>Address:</strong> ${order.address}</p>
              <p><strong>Order ID:</strong> ${order._id}</p>
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

          <div style="margin-top:15px; display:flex; justify-content:space-between;">
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

  // Separate orders into pending and completed
  const pendingOrders = orders.filter(order => order.status !== 'Completed');
  const completedOrders = orders.filter(order => order.status === 'Completed');

  const renderOrderCard = (order, showCompleteBtn = false) => (
    <div key={order._id} className="border p-4 rounded shadow-md bg-white relative">

      {/* Visible Info */}
      <p><strong>Name:</strong> {order.name}</p>
      <div className='flex'><h1 className='font-bold'>Invoice No.:</h1><h1>{order.invoiceNumber}</h1></div>
      <p><strong>Address:</strong> {order.address}</p>
      <p><strong>Product:</strong> {order.product?.name || 'N/A'}</p>
      <p><strong>Price:</strong> ₹{order.product?.price || 'N/A'}</p>
      <p><strong>Quantity:</strong> {order.quantity}</p>
      <p><strong>Total Price:</strong> ₹{order.product?.price * order.quantity}</p>
      <p><strong>Email:</strong> {order.email}</p>
      <p><strong>Mobile:</strong> {order.mobile || 'N/A'}</p>
      <p><strong>Payment ID:</strong> {order.paymentId}</p>
      <p><strong>Ordered On:</strong> {new Date(order.createdAt).toLocaleString()}</p>
      <p><strong>Status:</strong> {order.status || 'Pending'}</p>
      {/* Action Buttons */}
      <div className="flex gap-3 mt-3">
        {showCompleteBtn && (
          <button
            onClick={() => markCompleted(order._id)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
          >
            Mark as Completed
          </button>
        )}
        <button
          onClick={() => handlePrint(order._id)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer" >
          Print Bill
        </button>
      </div>
    </div>
  );


  return (
    <div className="m-2.5 p-4 max-w-full mx-auto w-full mt-[-15px] mb-[-6px] bg-gradient-to-br from-yellow-100 to-yellow-300 shadow-lg">
      <h2 className="text-3xl font-bold mb-6 mt-5 text-center">Order Dashboard</h2>

      <div className='routes  space-x-3 mb-3'>
        <span className="bg-gradient-to-r from-amber-200 to-amber-500 hover:from-amber-400 hover:to-amber-200 text-amber-900 font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 ease-in-out">
          <Link to="/" className="no-underline">Home</Link>
        </span>

        <span className="bg-gradient-to-r from-amber-200 to-amber-500 hover:from-amber-400 hover:to-amber-200 text-amber-900 font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 ease-in-out">
          <Link to="/add-product" className="no-underline">Dashboard</Link>
        </span>

      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <>
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4 hover:shadow-2xl">🕒 Pending Orders</h3>
            {pendingOrders.length === 0 ? (
              <p>No pending orders.</p>
            ) : (
              <div className="space-y-4">
                {pendingOrders.map(order => renderOrderCard(order, true))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-4 hover:shadow-2xl">✅ Completed Orders</h3>
            {completedOrders.length === 0 ? (
              <p>No completed orders yet.</p>
            ) : (
              <div className="space-y-4">
                {completedOrders.map(order => renderOrderCard(order))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default OrderDashboard;
