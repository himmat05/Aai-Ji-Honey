import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderApi } from '../../api/orderApi';
import { printTaxInvoice } from '../../utils/invoicePrinter';
import { formatDate } from '../../utils/formatters';

const OrderDashboardPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderApi.getOrders(1, 100);
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
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
      await orderApi.updateOrderStatus(id, 'Completed');
      toast.success('✅ Order marked as completed');
      fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error('❌ Failed to update order status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this order?')) return;

    try {
      await orderApi.deleteOrder(id);
      setOrders((prev) => prev.filter((order) => order._id !== id));
      toast.success('✅ Order deleted successfully');
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('❌ Failed to delete order');
    }
  };

  const pendingOrders = orders.filter((order) => order.status !== 'Completed');
  const completedOrders = orders.filter((order) => order.status === 'Completed');

  const filteredOrders =
    filter === 'pending' ? pendingOrders : filter === 'completed' ? completedOrders : orders;

  const totalRevenue = completedOrders.reduce((sum, order) => {
    const price = order.product?.price || 0;
    const qty = order.quantity || 1;
    return sum + price * qty;
  }, 0);

  const renderOrderCard = (order, isPending = false) => (
    <div
      key={order._id}
      className="honey-glass honey-glass-hover rounded-3xl p-6 border border-amber-200/80 shadow-lg flex flex-col justify-between"
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-4 pb-4 border-b border-amber-200/80">
          <div>
            <p className="text-[11px] font-black text-amber-700 uppercase tracking-widest">
              {order.invoiceNumber || 'INV-TEMP'}
            </p>
            <h3 className="text-xl font-black text-amber-950 mt-0.5 font-heading">
              {order.name}
            </h3>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-black shadow-sm flex items-center gap-1 ${
              order.status === 'Completed'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            {order.status === 'Completed' ? '✅ Completed' : '⏳ Pending'}
          </span>
        </div>

        {/* Product Details Box */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-amber-50/80 rounded-2xl p-3 border border-amber-200/60">
            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Honey Jar</p>
            <p className="font-extrabold text-amber-950 text-sm truncate">
              {order.product?.name || 'Artisanal Honey'}
            </p>
          </div>
          <div className="bg-amber-50/80 rounded-2xl p-3 border border-amber-200/60">
            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Quantity</p>
            <p className="font-extrabold text-amber-950 text-sm">
              × {order.quantity || 1}
            </p>
          </div>
          <div className="bg-amber-50/80 rounded-2xl p-3 border border-amber-200/60">
            <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Unit Price</p>
            <p className="font-extrabold text-amber-950 text-sm">
              ₹{order.product?.price || 0}
            </p>
          </div>
          <div className="bg-orange-100/70 rounded-2xl p-3 border border-orange-200">
            <p className="text-[10px] font-bold text-orange-800 uppercase tracking-wider">Total Billed</p>
            <p className="font-black text-orange-950 text-sm">
              ₹{(order.product?.price || 0) * (order.quantity || 1)}
            </p>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white/80 rounded-2xl p-4 mb-4 border border-amber-100 space-y-2 text-xs text-gray-700">
          <p className="flex items-center gap-2">
            <strong className="text-amber-950 font-bold min-w-[70px]">📧 Email:</strong>
            <span className="truncate">{order.email || 'N/A'}</span>
          </p>
          <p className="flex items-center gap-2">
            <strong className="text-amber-950 font-bold min-w-[70px]">📱 Mobile:</strong>
            <span>{order.mobile || 'N/A'}</span>
          </p>
          <p className="flex items-start gap-2">
            <strong className="text-amber-950 font-bold min-w-[70px]">📍 Address:</strong>
            <span className="leading-relaxed">{order.address || 'N/A'}</span>
          </p>
          <p className="flex items-center gap-2">
            <strong className="text-amber-950 font-bold min-w-[70px]">💳 Payment:</strong>
            <span className="font-mono text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              {order.paymentId || 'Cash / Verified'}
            </span>
          </p>
          <p className="flex items-center gap-2 text-[11px] text-gray-500 pt-1 border-t border-gray-100">
            <span>🕒 Order Placed: {formatDate(order.createdAt)}</span>
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 pt-2 border-t border-amber-200/60">
        {isPending && (
          <button
            onClick={() => markCompleted(order._id)}
            className="flex-1 min-w-[130px] px-3.5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow flex items-center justify-center gap-1.5"
          >
            <span>✅</span> Fulfill Order
          </button>
        )}

        <button
          onClick={() => printTaxInvoice(order)}
          className="flex-1 min-w-[120px] px-3.5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all border border-amber-300 flex items-center justify-center gap-1.5 shadow-sm"
        >
          <span>🖨️</span> Tax Invoice
        </button>

        <button
          onClick={() => handleDelete(order._id)}
          title="Delete Order Record"
          className="px-3 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl transition-all border border-red-200 flex items-center justify-center"
        >
          <span>🗑️</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
              <span>👑</span> Store Admin Hub
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-amber-950 font-heading">
              Orders Management & Dispatch
            </h1>
            <p className="text-xs sm:text-sm text-amber-800/80 mt-1 font-medium">
              Review honey shipments, update fulfillment milestones, and print GST tax invoices.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/add-product"
              className="btn-honey-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 no-underline shadow-lg"
            >
              <span>🍯</span>
              <span>Add / Manage Products</span>
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="honey-glass rounded-2xl p-5 border border-amber-200 shadow-sm">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
              Total Invoices
            </span>
            <p className="text-3xl font-black text-amber-950 mt-1 font-heading">
              {orders.length}
            </p>
          </div>

          <div className="honey-glass rounded-2xl p-5 border border-amber-200 shadow-sm">
            <span className="text-xs font-bold text-orange-700 uppercase tracking-wider block">
              Pending Orders
            </span>
            <p className="text-3xl font-black text-orange-600 mt-1 font-heading">
              {pendingOrders.length}
            </p>
          </div>

          <div className="honey-glass rounded-2xl p-5 border border-amber-200 shadow-sm">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
              Completed Orders
            </span>
            <p className="text-3xl font-black text-emerald-700 mt-1 font-heading">
              {completedOrders.length}
            </p>
          </div>

          <div className="honey-glass rounded-2xl p-5 border border-amber-200 shadow-sm">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
              Total Revenue
            </span>
            <p className="text-3xl font-black text-amber-950 mt-1 font-heading">
              ₹{totalRevenue}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl honey-glass border border-amber-200 max-w-fit shadow-sm">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                : 'text-amber-900 hover:bg-amber-100/60'
            }`}
          >
            All Orders ({orders.length})
          </button>

          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              filter === 'pending'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                : 'text-amber-900 hover:bg-amber-100/60'
            }`}
          >
            ⏳ Pending ({pendingOrders.length})
          </button>

          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
              filter === 'completed'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                : 'text-amber-900 hover:bg-amber-100/60'
            }`}
          >
            ✅ Completed ({completedOrders.length})
          </button>
        </div>

        {/* Orders Grid / Content */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-amber-950 font-bold text-sm">Gathering orders from database... 🍯</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="honey-glass rounded-3xl p-12 text-center border border-amber-200 shadow-lg max-w-md mx-auto">
            <span className="text-5xl block mb-3 animate-bounce">📦</span>
            <p className="text-xl text-amber-950 font-black font-heading">
              No orders in this category
            </p>
            <p className="text-xs text-amber-800 mt-1">
              New customer orders will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) =>
              renderOrderCard(order, order.status !== 'Completed')
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default OrderDashboardPage;
