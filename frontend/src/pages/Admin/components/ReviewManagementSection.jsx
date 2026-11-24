import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { reviewApi } from '../../../api/reviewApi';
import { formatDate } from '../../../utils/formatters';

const ReviewManagementSection = ({ onReviewsUpdated }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'approved' | 'hidden' | 'photos'
  const [search, setSearch] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewApi.getAdminReviews();
      const list = data?.reviews || [];
      setReviews(list);
      if (onReviewsUpdated) onReviewsUpdated(list.length);
    } catch (err) {
      console.error('Failed to load admin reviews:', err);
      toast.error('❌ Could not load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleApproval = async (id, currentStatus) => {
    // Optimistic UI update
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, is_approved: !r.is_approved } : r))
    );

    try {
      const res = await reviewApi.toggleReviewApproval(id);
      toast.success(res.message || 'Status updated');
    } catch (err) {
      console.error('Toggle approval failed:', err);
      toast.error('Failed to update review status');
      fetchReviews();
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this customer review?')) return;

    // Optimistic delete
    setReviews((prev) => prev.filter((r) => r.id !== id));
    toast.success('Review deleted');

    try {
      await reviewApi.deleteReview(id);
      if (onReviewsUpdated) onReviewsUpdated(reviews.length - 1);
    } catch (err) {
      console.error('Delete review failed:', err);
      toast.error('Failed to delete review on server');
      fetchReviews();
    }
  };

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews
      .filter((r) => {
        if (filter === 'approved') return r.is_approved;
        if (filter === 'hidden') return !r.is_approved;
        if (filter === 'photos') return Boolean(r.image_url);
        return true;
      })
      .filter((r) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          r.user_name?.toLowerCase().includes(q) ||
          r.user_email?.toLowerCase().includes(q) ||
          r.comment?.toLowerCase().includes(q) ||
          r.title?.toLowerCase().includes(q) ||
          r.location?.toLowerCase().includes(q)
        );
      });
  }, [reviews, filter, search]);

  const stats = useMemo(() => {
    const total = reviews.length;
    const approved = reviews.filter((r) => r.is_approved).length;
    const withPhotos = reviews.filter((r) => r.image_url).length;
    const avg = total > 0 ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / total).toFixed(1) : '5.0';
    return { total, approved, withPhotos, avg };
  }, [reviews]);

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="honey-glass rounded-2xl p-4 border border-amber-200 shadow-sm text-center">
          <p className="text-[11px] font-black uppercase tracking-wider text-amber-700">Total Reviews</p>
          <p className="text-2xl font-black text-amber-950 mt-1">{stats.total}</p>
        </div>
        <div className="honey-glass rounded-2xl p-4 border border-amber-200 shadow-sm text-center">
          <p className="text-[11px] font-black uppercase tracking-wider text-amber-700">Average Rating</p>
          <p className="text-2xl font-black text-amber-950 mt-1 flex items-center justify-center gap-1">
            <span className="text-amber-500">★</span>
            <span>{stats.avg}</span>
          </p>
        </div>
        <div className="honey-glass rounded-2xl p-4 border border-amber-200 shadow-sm text-center">
          <p className="text-[11px] font-black uppercase tracking-wider text-emerald-700">Live on Site</p>
          <p className="text-2xl font-black text-emerald-950 mt-1">{stats.approved}</p>
        </div>
        <div className="honey-glass rounded-2xl p-4 border border-amber-200 shadow-sm text-center">
          <p className="text-[11px] font-black uppercase tracking-wider text-amber-700">Photo Reviews</p>
          <p className="text-2xl font-black text-amber-950 mt-1">📸 {stats.withPhotos}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl honey-glass border border-amber-200 shadow-sm w-full md:w-auto">
          {[
            { id: 'all', label: `All (${reviews.length})` },
            { id: 'approved', label: `Visible (${stats.approved})` },
            { id: 'hidden', label: `Hidden (${reviews.length - stats.approved})` },
            { id: 'photos', label: `With Photos (${stats.withPhotos})` },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider transition-all text-center ${
                filter === btn.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                  : 'text-amber-900 hover:bg-amber-100/60'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search reviewer, comment, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl honey-glass border border-amber-300 text-xs text-amber-950 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
          />
        </div>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-20">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-amber-950 font-bold text-sm">Loading reviews... ⭐</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="honey-glass rounded-3xl p-12 text-center border border-amber-200 shadow-lg max-w-md mx-auto">
          <span className="text-5xl block mb-3 animate-bounce">⭐</span>
          <p className="text-xl text-amber-950 font-black font-heading">No reviews found</p>
          <p className="text-xs text-amber-800 mt-1">
            Customer reviews submitted from the homepage will appear here for management.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className={`honey-glass rounded-3xl p-6 border shadow-lg flex flex-col justify-between transition-all ${
                rev.is_approved
                  ? 'border-amber-200/90'
                  : 'border-red-200/90 bg-red-50/30 opacity-75'
              }`}
            >
              <div className="space-y-3">
                {/* Header: Rating, Category, and Status */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-amber-200/70">
                  <div>
                    <div className="flex items-center gap-1 text-amber-500 text-base">
                      {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full inline-block mt-1">
                      {rev.category || 'Quality'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        rev.is_approved
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-red-100 text-red-800 border border-red-300'
                      }`}
                    >
                      {rev.is_approved ? 'Visible Live ✓' : 'Hidden ✕'}
                    </span>
                  </div>
                </div>

                {/* Review Title & Body */}
                {rev.title && (
                  <h4 className="text-sm font-black text-amber-950">"{rev.title}"</h4>
                )}
                <p className="text-xs text-amber-900 leading-relaxed font-medium">
                  {rev.comment}
                </p>

                {/* Customer Photo */}
                {rev.image_url && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPhoto(rev.image_url)}
                      className="inline-flex items-center gap-2 p-1.5 rounded-xl border border-amber-300 bg-white/80 hover:bg-amber-100/60 transition-all text-xs font-bold text-amber-900 shadow-xs"
                    >
                      <img
                        src={rev.image_url}
                        alt="Customer honey jar"
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                      <span>📸 View Customer Photo</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Reviewer Details & Actions */}
              <div className="pt-4 mt-4 border-t border-amber-200/70 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-amber-950">{rev.user_name}</span>
                    {rev.is_verified_buyer || rev.badge_type === 'verified_buyer' ? (
                      <span className="px-2 py-0.2 rounded-full bg-amber-100 border border-amber-300 text-[9px] font-black text-amber-900">
                        Verified Buyer ✓
                      </span>
                    ) : rev.badge_type === 'community_member' ? (
                      <span className="px-2 py-0.2 rounded-full bg-emerald-50 border border-emerald-300 text-[9px] font-bold text-emerald-800">
                        Member 🌿
                      </span>
                    ) : (
                      <span className="px-2 py-0.2 rounded-full bg-gray-100 border border-gray-300 text-[9px] font-semibold text-gray-700">
                        Reviewer 📍
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-amber-800/80 mt-0.5">
                    {rev.location || 'India'}
                    {rev.user_email && ` • ${rev.user_email}`}
                    {rev.created_at && ` • ${formatDate(rev.created_at)}`}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleApproval(rev.id, rev.is_approved)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                      rev.is_approved
                        ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
                        : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border-emerald-300'
                    }`}
                  >
                    {rev.is_approved ? 'Hide from Site 👁️' : 'Show on Site ✓'}
                  </button>

                  <button
                    onClick={() => handleDeleteReview(rev.id)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-100 hover:bg-red-200 text-red-900 border border-red-300 transition-all shadow-xs"
                    title="Delete permanently"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Enlarged Photo Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-xl max-h-[90vh] bg-black rounded-2xl overflow-hidden p-2 border border-amber-400/40">
            <img
              src={selectedPhoto}
              alt="Enlarged customer photo"
              className="max-h-[80vh] w-auto mx-auto object-contain rounded-xl"
            />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white font-black flex items-center justify-center shadow-lg"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewManagementSection;
