import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { productApi } from '../../api/productApi';

const STAR_LABELS = {
  1: 'Poor / Disappointed',
  2: 'Fair / Below Expectation',
  3: 'Good / Satisfied',
  4: 'Very Good / High Quality',
  5: 'Exceptional / 100% Pure Raw Honey',
};

const RatingModal = ({ isOpen, onClose, product, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingExisting, setIsLoadingExisting] = useState(false);

  const productId = product?.id || product?._id;

  useEffect(() => {
    if (isOpen && productId) {
      setIsLoadingExisting(true);
      productApi
        .getMyRating(productId)
        .then((data) => {
          if (data?.rating) {
            setRating(data.rating);
            setReview(data.review || '');
          } else {
            setRating(5);
            setReview('');
          }
        })
        .catch(() => {
          setRating(5);
          setReview('');
        })
        .finally(() => setIsLoadingExisting(false));
    }
  }, [isOpen, productId]);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || rating < 1 || rating > 5) {
      toast.error('Please select a star rating between 1 and 5.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await productApi.rateProduct(productId, {
        rating,
        review: review.trim(),
      });
      toast.success(res.message || '⭐ Rating submitted successfully!');
      if (onSuccess) {
        onSuccess(res);
      }
      onClose();
    } catch (err) {
      console.error('Rating submission failed:', err);
      toast.error(err.response?.data?.error || 'Failed to submit rating. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeRating = hoverRating || rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border-2 border-amber-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍯</span>
            <div>
              <h3 className="font-black text-lg font-heading">Rate This Honey</h3>
              <p className="text-amber-100 text-xs">Share your experience with Aai Ji Honey</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Product Mini Preview */}
          <div className="flex items-center gap-3 bg-amber-50/70 p-3 rounded-2xl border border-amber-200/80">
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-14 h-14 object-contain rounded-xl bg-white p-1 border border-amber-200 shadow-xs"
              />
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-amber-950 text-sm truncate">{product.name}</h4>
              <p className="text-xs text-amber-700 font-medium">Verified Customer Review</p>
            </div>
          </div>

          {/* Interactive Star Selection */}
          <div className="text-center py-2">
            <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
              Select Your Rating (1 - 5 Stars)
            </label>
            <div className="flex justify-center items-center gap-2 text-4xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform duration-150 hover:scale-125 focus:outline-none"
                >
                  <span
                    className={
                      star <= activeRating
                        ? 'text-amber-400 drop-shadow-[0_2px_4px_rgba(245,158,11,0.4)]'
                        : 'text-gray-200 hover:text-amber-200'
                    }
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>

            {/* Active Star Label */}
            <p className="text-xs font-extrabold text-amber-800 mt-2 min-h-[18px]">
              {STAR_LABELS[activeRating] || ''}
            </p>
          </div>

          {/* Optional Review Text */}
          <div>
            <label className="block text-xs font-semibold text-amber-900 mb-1.5">
              Review & Tasting Feedback (Optional)
            </label>
            <textarea
              rows={3}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="How was the floral aroma, sweetness, and consistency?"
              className="w-full border-2 border-amber-200 p-3 rounded-xl focus:outline-none focus:border-amber-500 transition-colors bg-amber-50/20 text-xs text-amber-950"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl text-xs hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoadingExisting}
              className="flex-2 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-bold rounded-xl text-xs shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              {isSubmitting ? 'Submitting...' : '⭐ Submit Rating'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default RatingModal;
