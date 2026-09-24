import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import couponApi from '../../../api/couponApi';

const CouponManagementSection = ({ onCouponsUpdated }) => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [code, setCode] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState(15);
  const [minOrderAmount, setMinOrderAmount] = useState(500);
  const [maxDiscount, setMaxDiscount] = useState(250);
  const [description, setDescription] = useState('');

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await couponApi.getAdminCoupons();
      if (data?.coupons) {
        setCoupons(data.coupons);
        if (onCouponsUpdated) onCouponsUpdated(data.coupons.length);
      }
    } catch (err) {
      console.error('Failed to load coupons:', err);
      toast.error('Could not load promo codes from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();

    const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    if (!cleanCode) {
      toast.error('Please enter a valid promo code');
      return;
    }

    const cleanPct = parseInt(discountPercentage, 10);
    if (isNaN(cleanPct) || cleanPct <= 0 || cleanPct > 100) {
      toast.error('Discount percentage must be between 1% and 100%');
      return;
    }

    const payload = {
      code: cleanCode,
      discountPercentage: cleanPct,
      minOrderAmount: parseFloat(minOrderAmount) || 0,
      maxDiscount: maxDiscount ? parseFloat(maxDiscount) : null,
      description: description.trim() || `${cleanPct}% OFF on pure raw honey orders`,
    };

    try {
      setIsSubmitting(true);
      const res = await couponApi.createCoupon(payload);

      if (res?.coupon) {
        toast.success(`🎉 Promo code "${res.coupon.code}" created successfully!`);
        setCoupons((prev) => [res.coupon, ...prev]);
        if (onCouponsUpdated) onCouponsUpdated(coupons.length + 1);

        // Reset form to defaults
        setCode('');
        setDiscountPercentage(15);
        setMinOrderAmount(500);
        setMaxDiscount(250);
        setDescription('');
      }
    } catch (err) {
      console.error('Error creating promo code:', err);
      const msg = err.response?.data?.message || 'Failed to create promo code';
      toast.error(`❌ ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCoupon = async (id, codeName) => {
    if (!window.confirm(`Are you sure you want to permanently delete promo code "${codeName}"?`)) {
      return;
    }

    // Optimistic UI update
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    toast.success(`🗑️ Promo code "${codeName}" deleted`);
    if (onCouponsUpdated) onCouponsUpdated(Math.max(0, coupons.length - 1));

    try {
      await couponApi.deleteCoupon(id);
    } catch (err) {
      console.error('Delete coupon failed:', err);
      toast.error('Failed to sync deletion with database');
      fetchCoupons();
    }
  };

  const handleToggleStatus = async (id) => {
    // Optimistic toggle
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, is_active: !c.is_active } : c))
    );

    try {
      const res = await couponApi.toggleCouponStatus(id);
      if (res?.coupon) {
        toast.success(
          `Promo code "${res.coupon.code}" is now ${res.coupon.is_active ? 'Active' : 'Inactive'}`
        );
      }
    } catch (err) {
      console.error('Toggle status failed:', err);
      toast.error('Failed to update promo code status');
      fetchCoupons();
    }
  };

  // Stats calculation
  const totalCodes = coupons.length;
  const activeCodes = coupons.filter((c) => c.is_active).length;
  const avgDiscount =
    totalCodes > 0
      ? Math.round(
          coupons.reduce((sum, c) => sum + (parseInt(c.discount_percentage, 10) || 0), 0) /
            totalCodes
        )
      : 0;

  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out] text-left">
      {/* Header Banner & Stats */}
      <div className="honey-glass rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200/80 pb-6">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🏷️</span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black font-heading text-amber-950">
                Promo Codes &amp; Discount Vouchers
              </h2>
              <p className="text-xs sm:text-sm text-amber-800 font-medium mt-0.5">
                Create, customize, and manage discount percentages for your honey customers.
              </p>
            </div>
          </div>

          <button
            onClick={fetchCoupons}
            disabled={loading}
            className="px-4 py-2 rounded-2xl honey-glass border border-amber-300 text-amber-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-100 transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <span>🔄</span>
            <span>Refresh Codes</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="honey-glass rounded-2xl p-4 border border-amber-200 shadow-xs">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
              Total Vouchers
            </span>
            <span className="text-2xl sm:text-3xl font-black text-amber-950 font-heading">
              {totalCodes}
            </span>
          </div>

          <div className="honey-glass rounded-2xl p-4 border border-amber-200 shadow-xs">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
              Active Vouchers
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 font-heading">
              {activeCodes}
            </span>
          </div>

          <div className="honey-glass rounded-2xl p-4 border border-amber-200 shadow-xs">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
              Average Discount
            </span>
            <span className="text-2xl sm:text-3xl font-black text-amber-950 font-heading">
              {avgDiscount}%
            </span>
          </div>

          <div className="honey-glass rounded-2xl p-4 border border-amber-200 shadow-xs">
            <span className="text-[11px] font-bold text-purple-800 uppercase tracking-wider block">
              Cart Integration
            </span>
            <span className="text-sm font-black text-purple-900 mt-1 block">
              ● Live Sync Active
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Add Promo Code Form (Left) + Codes List (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Create New Promo Code Form */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="honey-glass rounded-3xl p-6 sm:p-7 border-2 border-amber-300/90 shadow-xl space-y-5">
            <div className="flex items-center gap-2 border-b border-amber-200 pb-3">
              <span className="text-2xl">✨</span>
              <div>
                <h3 className="text-lg font-black text-amber-950 font-heading">
                  Create New Promo Code
                </h3>
                <p className="text-xs text-amber-800">
                  Adds an instant discount percentage to customer checkouts
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              {/* Promo Code Name */}
              <div>
                <label className="block text-xs font-bold text-amber-900 mb-1">
                  Promo Code (Uppercase) *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. FESTIVE20, AAIJI15"
                    value={code}
                    onChange={(e) =>
                      setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ''))
                    }
                    className="w-full pl-8 pr-4 py-2.5 rounded-xl border-2 border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono font-black text-amber-950 text-sm bg-white"
                  />
                  <span className="absolute left-3 top-2.5 text-xs text-amber-600">🏷️</span>
                </div>
                <span className="text-[11px] text-stone-500 mt-0.5 block">
                  Letters, numbers, and hyphens only (auto-uppercased)
                </span>
              </div>

              {/* Discount Percentage */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-amber-900">
                    Discount Percentage (%) *
                  </label>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    {discountPercentage}% OFF
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="range"
                    min="1"
                    max="90"
                    step="1"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(parseInt(e.target.value, 10))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={discountPercentage}
                    onChange={(e) =>
                      setDiscountPercentage(Math.max(1, Math.min(100, parseInt(e.target.value, 10) || 1)))
                    }
                    className="w-16 p-2 rounded-xl border border-amber-300 font-bold text-sm text-center bg-white"
                  />
                </div>

                {/* Quick Presets */}
                <div className="flex gap-1.5 mt-2">
                  {[5, 10, 15, 20, 25, 30].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setDiscountPercentage(pct)}
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                        discountPercentage === pct
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-white hover:bg-amber-100/70 border-amber-200 text-amber-900'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Min Order & Max Discount in 2 columns */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-amber-900 mb-1">
                    Min Order Value (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    placeholder="e.g. 500"
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 text-xs font-bold text-amber-950 bg-white"
                  />
                  <span className="text-[10px] text-stone-500">₹0 for no minimum</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-900 mb-1">
                    Max Discount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    placeholder="e.g. 300 (Optional)"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-amber-300 text-xs font-bold text-amber-950 bg-white"
                  />
                  <span className="text-[10px] text-stone-500">Leave blank for uncapped</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-amber-900 mb-1">
                  Description / Offer Tagline
                </label>
                <textarea
                  rows={2}
                  placeholder={`e.g. ${discountPercentage}% OFF on all raw honey orders above ₹${minOrderAmount || 0}`}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-amber-300 text-xs font-medium text-amber-950 bg-white resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-honey-primary w-full py-3.5 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin text-sm">⏳</span>
                    <span>Creating Promo Code...</span>
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    <span>Create Promo Code ({discountPercentage}%)</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Existing Promo Codes List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b border-amber-200/80 pb-3">
            <h3 className="font-heading font-black text-xl text-amber-950 flex items-center gap-2">
              <span>📋</span>
              <span>Available Promo Codes ({coupons.length})</span>
            </h3>
            <span className="text-xs font-bold text-amber-800">
              {activeCodes} active in customer cart
            </span>
          </div>

          {loading ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 border-4 border-amber-300 border-t-amber-600 rounded-full animate-spin mx-auto"></div>
              <p className="text-xs font-bold text-amber-900">Loading Promo Codes...</p>
            </div>
          ) : coupons.length === 0 ? (
            <div className="honey-glass rounded-3xl p-12 text-center space-y-4 border border-amber-200">
              <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 flex items-center justify-center text-4xl shadow-inner">
                🏷️
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-black text-lg text-amber-950">
                  No Promo Codes Configured
                </h4>
                <p className="text-xs text-amber-900/70 max-w-sm mx-auto">
                  There are currently no promo codes available. Create your first discount voucher on the left to offer checkout savings to your customers.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {coupons.map((c) => {
                const discountPct = parseInt(c.discount_percentage, 10);
                const minOrder = parseFloat(c.min_order_amount) || 0;
                const maxDisc = c.max_discount ? parseFloat(c.max_discount) : null;

                return (
                  <div
                    key={c.id}
                    className={`honey-glass rounded-2xl p-5 border transition-all duration-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      c.is_active
                        ? 'border-amber-300/90 bg-white/95'
                        : 'border-stone-200 bg-stone-50/70 opacity-75'
                    }`}
                  >
                    {/* Left: Code, Badge & Details */}
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="px-3 py-1 rounded-xl bg-amber-100 text-amber-950 font-mono font-black text-base border-2 border-amber-400 tracking-wider shadow-2xs">
                          {c.code}
                        </span>

                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white font-black text-xs uppercase tracking-wider shadow-xs">
                          {discountPct}% OFF
                        </span>

                        {c.is_active ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold flex items-center gap-1 border border-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 text-[10px] font-bold">
                            Inactive
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-amber-950/80 font-medium">
                        {c.description || `${discountPct}% discount applied at checkout`}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-stone-500 font-semibold flex-wrap">
                        <span>
                          Min Order: <strong className="text-amber-950">₹{minOrder}</strong>
                        </span>
                        <span>•</span>
                        <span>
                          Max Cap: <strong className="text-amber-950">{maxDisc ? `₹${maxDisc}` : 'Uncapped'}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Right: Actions (Toggle Active + Delete) */}
                    <div className="flex items-center gap-2 sm:self-center border-t sm:border-t-0 pt-3 sm:pt-0 border-amber-100">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(c.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer border ${
                          c.is_active
                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                        }`}
                        title={c.is_active ? 'Deactivate this promo code' : 'Activate this promo code'}
                      >
                        {c.is_active ? '⏸️ Deactivate' : '▶️ Activate'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteCoupon(c.id, c.code)}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 hover:text-white hover:bg-red-600 border border-red-200 transition-all shadow-2xs cursor-pointer flex items-center gap-1"
                        title="Delete promo code permanently"
                      >
                        <span>🗑️</span>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default CouponManagementSection;
