import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { reviewApi } from '../api/reviewApi';
import useAuth from '../hooks/useAuth';

const RATING_LABELS = {
  1: '★ Needs Improvement',
  2: '★★ Fair Quality',
  3: '★★★ Good & Pure',
  4: '★★★★ Very High Quality',
  5: '★★★★★ Pure Magic! 🍯 (Outstanding)',
};

const CATEGORIES = [
  { id: 'quality', label: '🍯 Honey Taste & Quality' },
  { id: 'delivery', label: '📦 Delivery & Packaging' },
  { id: 'service', label: '🌐 Website & Service' },
  { id: 'purity', label: '🐝 Purity & Apiary Trust' },
];

const WriteReviewModal = ({ isOpen, onClose, onReviewSubmitted }) => {
  const { user } = useAuth();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState('quality');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill user details if logged in
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      if (user.city || user.state) {
        setLocation([user.city, user.state].filter(Boolean).join(', '));
      }
    }
  }, [user, isOpen]);

  // Handle image selection with preview
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPEG, PNG, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating) {
      toast.error('Please select a star rating (1 to 5 stars)');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please share a few words about your experience');
      return;
    }

    if (!user && !name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('rating', rating);
      formData.append('category', category);
      formData.append('title', title.trim());
      formData.append('comment', comment.trim());
      formData.append('name', name.trim() || 'Honey Lover');
      formData.append('location', location.trim() || 'India');
      if (email.trim()) formData.append('email', email.trim());
      if (imageFile) formData.append('image', imageFile);

      const res = await reviewApi.createReview(formData);

      toast.success('🍯 Thank you! Your review has been added to our community.');
      if (onReviewSubmitted && res.review) {
        onReviewSubmitted(res.review);
      }

      // Reset form
      setRating(5);
      setTitle('');
      setComment('');
      removeImage();
      onClose();
    } catch (err) {
      console.error('Error submitting review:', err);
      toast.error(err.response?.data?.error || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-amber-950/60 backdrop-blur-md overflow-y-auto animate-[fadeIn_0.2s_ease-out]">
      <div
        className="relative w-full max-w-xl my-8 bg-gradient-to-b from-amber-50/95 via-white to-amber-50/90 rounded-3xl p-6 sm:p-8 border border-amber-200/90 shadow-2xl shadow-amber-900/20 text-amber-950 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-amber-400/20 to-orange-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-amber-200/80 mb-5 relative z-10">
          <div>
            <span className="px-3 py-1 rounded-full bg-amber-200/70 text-amber-900 text-[11px] font-black uppercase tracking-wider inline-flex items-center gap-1">
              <span>🍯</span> Community Voice
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-amber-950 font-heading mt-1.5">
              Write a Review
            </h3>
            <p className="text-xs text-amber-800/80 mt-0.5">
              Share your genuine experience with our raw honey, packaging, or service.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center text-lg font-bold transition-all shadow-xs"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {/* Star Rating Selector */}
          <div className="text-center py-2 bg-amber-100/40 rounded-2xl border border-amber-200/70 p-3">
            <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1.5">
              Your Overall Rating *
            </label>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isLit = (hoverRating || rating) >= star;
                return (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="text-3xl sm:text-4xl transition-transform hover:scale-125 focus:outline-none"
                  >
                    <span className={isLit ? 'text-amber-500 drop-shadow-sm' : 'text-amber-200'}>
                      ★
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs font-extrabold text-amber-900 mt-1 min-h-[18px]">
              {RATING_LABELS[hoverRating || rating]}
            </p>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1.5">
              Feedback Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border text-left truncate ${
                    category === cat.id
                      ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                      : 'bg-white/80 hover:bg-amber-100/70 text-amber-950 border-amber-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Review Headline / Title */}
          <div>
            <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
              Headline / Title <span className="text-amber-600 font-normal">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Purest raw honey with authentic natural floral aroma"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-amber-200 text-xs text-amber-950 placeholder-amber-900/40 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
              maxLength={150}
            />
          </div>

          {/* Review Description */}
          <div>
            <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
              Your Review / Experience *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Tell other honey lovers how you enjoyed it, its texture, flavor, or delivery speed..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 border border-amber-200 text-xs text-amber-950 placeholder-amber-900/40 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner resize-none"
              maxLength={2000}
            />
          </div>

          {/* Photo Upload (Optional) */}
          <div>
            <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
              Add a Photo of Your Honey / Dish <span className="text-amber-600 font-normal">(Optional)</span>
            </label>
            {!imagePreview ? (
              <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50/60 hover:bg-amber-100/50 cursor-pointer transition-all text-xs font-bold text-amber-900">
                <span>📸</span>
                <span>Click to upload honey jar photo (JPEG, PNG, WebP)</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative inline-block mt-1">
                <img
                  src={imagePreview}
                  alt="Review preview"
                  className="w-24 h-24 object-cover rounded-2xl border-2 border-amber-400 shadow-md"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center shadow-md hover:bg-red-700"
                  title="Remove photo"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* User Identification Section */}
          {user ? (
            <div className="p-3 bg-amber-100/60 rounded-2xl border border-amber-300 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-amber-500 text-white font-black flex items-center justify-center text-sm shadow-xs">
                  {user.name ? user.name[0].toUpperCase() : '👤'}
                </span>
                <div>
                  <p className="font-extrabold text-amber-950">
                    Posting as {user.name || user.email}
                  </p>
                  <p className="text-[11px] text-amber-800">
                    {location || 'Rajasthan, India'} • Logged in Account
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-black text-[10px]">
                Verified Member ✓
              </span>
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patel"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/90 border border-amber-200 text-xs text-amber-950 placeholder-amber-900/40 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                    City / State <span className="text-amber-600 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jaipur, Rajasthan"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white/90 border border-amber-200 text-xs text-amber-950 placeholder-amber-900/40 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                    maxLength={100}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                  Email Address <span className="text-amber-600 font-normal">(Kept 100% private)</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. ramesh@example.com (used to grant Verified Buyer tag)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-white/90 border border-amber-200 text-xs text-amber-950 placeholder-amber-900/40 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                  maxLength={150}
                />
                <p className="text-[10px] text-amber-800/70 mt-0.5">
                  🔒 We never display your email publicly. If you have ordered from us before, your review will automatically receive a <strong>Verified Buyer ✓</strong> tag!
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-amber-200/80">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 transition-all shadow-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all shadow-md shadow-orange-900/20 disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <span>🍯</span>
                  <span>Submit Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WriteReviewModal;
