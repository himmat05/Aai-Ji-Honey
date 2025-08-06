import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const OrderDashboard = () => {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const countref = useRef(1);


    const fetchOrders = async () => {
        try {
            // const res = await axios.get('http://localhost:5000/orders');
            // setOrders(res.data);
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
            // await axios.patch(`http://localhost:5000/orders/${id}`, {
            //     status: 'Completed',

            // });
            await axios.patch(`${import.meta.env.VITE_API_URL}/orders/${id}`, {
                status: 'Completed',
            });
            fetchOrders(); // refresh the order list
        } catch (err) {
            console.error('Error updating order status', err);
        }
    };


    // const handlePrint = (orderId) => {
    //     const content = document.getElementById(`print-section-${orderId}`).innerHTML;
    //     const original = document.body.innerHTML;

    //     document.body.innerHTML = content;
    //     window.print();
    //     document.body.innerHTML = original;
    //     window.location.reload(); // To restore the React view after print
    //     countref.current += 1;
    // };

    const handlePrint = (orderId) => {
  const content = document.getElementById(`print-section-${orderId}`);
  if (!content) return;

  const printWindow = window.open('', '', 'width=800,height=600');

  printWindow.document.write(`
    <html>
      <head>
        <title>Invoice</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          h2 {
            margin-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          table, th, td {
            border: 1px solid black;
          }
          th, td {
            padding: 8px;
            text-align: left;
          }
        </style>
      </head>
      <body>
        ${content.innerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
  printWindow.close();
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

            Printable Hidden Section
            <div id={`print-section-${order._id}`} className="hidden printable bg-white p-6">

                {/* bill format */}
                {/* <div>
                    <div className='bg-green-300 border-2 border-black'>
                        <div className='mx-auto text-center mt-2'>
                            <h1>Jai Shri Aai Mata Namo Namah</h1>
                            <h1 className='underline'>Tax Invoice</h1>
                        </div>
                        <div className='flex items-center justify-around gap-10 mt-2'>
                            <div className='ml-5'>
                                <h1>GSTIN:08HIAPS1709H1Z5</h1>
                                <h1>Email: aaijihoney24@gmail.com</h1>
                            </div>
                            <div>
                                <h1>Contact : +91 9610047740</h1>
                                <h1 className='ml-17'>+91 9887918251</h1>
                            </div>
                        </div>
                        <div className='flex items-center gap-2 mt-0.5 mb-0.5 w-full justify-center'>
                            <img src='Aai ji honey.jpg' className='w-18 rounded-full' />
                            <h1 className='font-light-bold text-5xl'>Aai Ji Honey</h1>
                        </div>
                        <div>
                            <div className=''><h1 className='font-bold pl-1'>Head office</h1><h1 className='ml-5'>426,Aai mata colony, Megakheda,Post-Pipli Ahiran,Teh-Kunwariya,Dist-Rajsamand,Rajasthan, PIN-313327,India.</h1></div>
                            <h1 className='flex items-center justify-center font-bold'>(Raw honey ,Processed Honey , Multi-floral Honey,Herbal Honey,Edible Honey)</h1>
                        </div>
                    </div>
                    <div className='mt-2 flex border-2 border-black bg-amber-200'>
                        <div className='w-3/5 border-r-2 border-black pr-2'>
                            <h1 className='font-bold'>Customer Details :</h1>
                            <div className='flex'><h1 className='font-bold'>GSTIN: </h1><h1> 08AHFPC5892E1ZC</h1></div>
                            <div className='flex'><h1 className='font-bold'>Name : </h1><h1> {order.name}</h1></div>
                            <div className='flex'><h1 className='font-bold'>Mobile: </h1><h1> {order.mobile}</h1></div>
                            <div className='flex'><h1 className='font-bold'>Email: </h1><h1> {order.email}</h1></div>
                            <div className='flex'><h1 className='font-bold'>Address : </h1><h1> {order.address}</h1></div>
                            <div className='flex'><h1 className='font-bold'>Order id : </h1><h1> {order._id}</h1></div>
                        </div>
                        <div className='w-2/5 pl-2'>
                            <div className='flex'><h1 className='font-bold'>Date:</h1><h1> {new Date(order.createdAt).toLocaleString()}</h1></div>
                            <div className='flex'><h1 className='font-bold'>Invoice No.:</h1><h1>{order.invoiceNumber}</h1></div>
                            <div className='flex'><h1 className='font-bold'>Supply state :</h1><h1> Rajasthan</h1></div>
                            <div className='flex'><h1 className='font-bold'>Supply mode : </h1><h1> Delivery</h1></div>
                            <div className='flex'><h1 className='font-bold'>Ordered by :</h1><h1> MR. Bhanwar lal</h1></div>
                        </div>
                    </div>
                    <div className='mt-3'>
                        <table className='w-full'>
                            <thead>
                                <tr className=' border-black'>
                                    <th className='border-2 border-black'>S.No</th>
                                    <th className='border-2 border-black'>Description of Items</th>
                                    <th className='border-2 border-black'>HSN code</th>
                                    <th className='border-2 border-black'>Quantity</th>
                                    <th className='border-2 border-black'>Price ₹</th>
                                    <th className='border-2 border-black'>Total Price ₹</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className='row-span-2'>
                                    <td className='font-bold border-2 border-black row-span-2 pl-3'>1</td>
                                    <td className='border-2 border-black pl-1 row-span-2'>{order.product?.name || 'N/A'}</td>
                                    <td className='font-bold border-2 border-black row-span-2 pl-3'>0409</td>
                                    <td className='border-2 border-black pl-1 row-span-2'>{order.quantity}</td>
                                    <td className='border-2 border-black pl-1 row-span-2'>{order.product?.price || 'N/A'}</td>
                                    <td className='border-2 border-black pl-1 row-span-2'>{order.product?.price * order.quantity}</td>
                                </tr>
                                <tr className='mt-1'>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td className='font-bold border-2 border-black pl-1'>Pt fee ₹</td>
                                    <td className='border-2 border-black pl-1'>{(order.product?.price * order.quantity * 0.0236).toFixed(2)}</td>
                                    <td className='border-2 border-black pl-1'>{(order.product?.price * order.quantity * 0.0236) + (order.product?.price * order.quantity)}</td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td className='font-bold border-2 border-black pl-1'>Delivery ₹</td>
                                    <td className=' border-2 border-black pl-1'>{order.product?.price * order.quantity < 990 ? 100 : 0}</td>
                                    <td className=' border-2 border-black pl-1'>{((order.product?.price * order.quantity < 990 ? 100 : 0) + ((order.product?.price * order.quantity * 0.0236) + (order.product?.price * order.quantity))).toFixed(2)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className='flex'>
                        <div>
                            <h1 className='font-bold'>Terms & Condition :</h1>
                            <ul>
                                <li>E & O.E</li>
                                <li>All disputes subjects to "UDAIPUR" Jurisdictions only.</li>
                            </ul>
                        </div>
                        <div className='flex mt-3 ml-6 float-right'>
                            <div>
                                <img src='Signature.png' className='w-20 ml-8' />
                            </div>
                            <div className='mt-5  text-right'>
                                <h1 className='font-bold'>For - Aai Ji Honey</h1>
                                <h4>Authorized signature</h4>
                            </div>
                        </div>
                    </div>
                </div> */}
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
