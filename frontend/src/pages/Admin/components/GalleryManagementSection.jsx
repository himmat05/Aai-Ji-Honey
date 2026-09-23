import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { galleryApi } from '../../../api/galleryApi';
import { compressImage } from '../../../utils/imageCompressor';

const PRESET_TAGS = [
  'FOUNDER & ENTOMOLOGIST',
  'HIVE MANAGEMENT',
  'NATURAL ENVIRONMENT',
  'ETHICAL HOUSING',
  'COLONY CARE',
  'NATURAL HARVEST',
  'READY HARVEST',
  'BEEKEEPING HERITAGE',
  'COMMUNITY EMPOWERMENT',
  'COLD EXTRACTION',
  'QUALITY ASSURANCE',
  'BIODIVERSITY',
  'HYGIENIC PACKAGING',
  'PURITY PROMISE',
];

const GalleryManagementSection = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editId, setEditId] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('');
  const [customTag, setCustomTag] = useState('');
  const [description, setDescription] = useState('');
  const [orderNum, setOrderNum] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [directUrl, setDirectUrl] = useState('');
  const [useUrlInput, setUseUrlInput] = useState(false);

  const fileInputRef = useRef(null);
  const formTopRef = useRef(null);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const data = await galleryApi.getGalleryItems();
      setItems(data);
    } catch (err) {
      console.error('Failed to load gallery items:', err);
      toast.error('Could not load gallery items from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB.');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setTitle('');
    setTag('');
    setCustomTag('');
    setDescription('');
    setOrderNum(items.length + 1);
    setImageFile(null);
    setImagePreview('');
    setDirectUrl('');
    setUseUrlInput(false);
    setEditId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setTitle(item.title || '');
    setDescription(item.description || item.desc || '');
    setOrderNum(item.orderNum !== undefined ? item.orderNum : (item.order_num || 0));

    const itemTag = item.tag || '';
    if (PRESET_TAGS.includes(itemTag)) {
      setTag(itemTag);
      setCustomTag('');
    } else if (itemTag) {
      setTag('Other');
      setCustomTag(itemTag);
    } else {
      setTag('');
      setCustomTag('');
    }

    setImageFile(null);
    setImagePreview(item.src || '');
    setDirectUrl(item.src || '');
    setUseUrlInput(false);

    if (formTopRef.current) {
      formTopRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDelete = async (id, itemTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${itemTitle || 'this photo'}" from the gallery?`)) {
      return;
    }

    try {
      await galleryApi.deleteGalleryItem(id);
      toast.success('Gallery photo deleted successfully');
      setItems((prev) => prev.filter((it) => it._id !== id));
      if (editId === id) resetForm();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error(err.response?.data?.error || 'Failed to delete gallery item');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Please enter a photo title.');
      return;
    }

    const resolvedTag = tag === 'Other' ? customTag.trim() : (tag || customTag.trim() || 'APIARY');
    const resolvedImage = useUrlInput ? directUrl.trim() : null;

    if (!editId && !imageFile && !resolvedImage) {
      toast.error('Please select an image file from your device or provide an image URL.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('tag', resolvedTag);
      formData.append('description', description.trim());
      formData.append('orderNum', orderNum);

      if (imageFile) {
        const compressed = await compressImage(imageFile, 1400, 0.82);
        formData.append('image', compressed);
      } else if (resolvedImage) {
        formData.append('src', resolvedImage);
      }

      if (editId) {
        const updated = await galleryApi.updateGalleryItem(editId, formData);
        setItems((prev) => prev.map((it) => (it._id === editId ? updated : it)));
        toast.success('✅ Gallery photo updated successfully!');
      } else {
        const created = await galleryApi.addGalleryItem(formData);
        setItems((prev) => [created, ...prev]);
        toast.success('✅ Photo added to gallery successfully!');
      }

      resetForm();
    } catch (err) {
      console.error('Save error:', err);
      toast.error(err.response?.data?.error || 'Failed to save gallery item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
      {/* Header Info */}
      <div ref={formTopRef} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
            <span>📸</span> Apiary Gallery Manager
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-amber-950 font-heading">
            {editId ? '✏️ Edit Gallery Photo' : '📸 Add New Gallery Photo'}
          </h2>
          <p className="text-amber-800 text-xs sm:text-sm mt-1">
            Manage photos showcased on the Homepage & About page. Upload from your device to Cloudinary.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="honey-glass px-4 py-2 rounded-2xl border border-amber-300 text-xs font-black text-amber-950">
            {items.length} Photos in Gallery
          </span>
          {editId && (
            <button
              onClick={resetForm}
              className="px-4 py-2 rounded-2xl bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold transition-colors"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {/* Form Card */}
      <div className="honey-glass rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Image Upload & Preview Box */}
            <div className="lg:col-span-1 space-y-3">
              <label className="block text-xs font-black uppercase tracking-wider text-amber-950">
                Gallery Image *
              </label>

              {/* Preview Window */}
              <div className="relative w-full h-56 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50/50 flex flex-col items-center justify-center overflow-hidden group">
                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md transition"
                      >
                        Change Photo
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview('');
                          setDirectUrl('');
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="px-3 py-1.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold shadow-md transition"
                      >
                        Remove
                      </button>
                    </div>
                  </>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer text-center p-4 hover:scale-102 transition"
                  >
                    <span className="text-4xl block mb-2">📁</span>
                    <p className="text-xs font-bold text-amber-950">Click to upload from device</p>
                    <p className="text-[11px] text-amber-700/80 mt-1">JPEG, PNG, WebP up to 5MB</p>
                  </div>
                )}
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/jpg"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Toggle direct URL input */}
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="font-bold text-amber-800 hover:text-amber-950 underline"
                >
                  Choose Local File
                </button>
                <button
                  type="button"
                  onClick={() => setUseUrlInput(!useUrlInput)}
                  className="text-amber-700 hover:text-amber-900 font-medium"
                >
                  {useUrlInput ? 'Hide URL input' : 'Or paste Image URL'}
                </button>
              </div>

              {useUrlInput && (
                <input
                  type="text"
                  placeholder="https://... or /image.jpg"
                  value={directUrl}
                  onChange={(e) => {
                    setDirectUrl(e.target.value);
                    setImagePreview(e.target.value);
                  }}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-white border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-amber-950"
                />
              )}
            </div>

            {/* Right: Inputs */}
            <div className="lg:col-span-2 space-y-4">
              {/* Photo Title */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-amber-950 mb-1.5">
                  Photo Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Sustainable Desert Apiculture"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/90 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-semibold text-amber-950 placeholder-amber-700/40"
                  required
                />
              </div>

              {/* Tag / Category Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-amber-950 mb-1.5">
                    Category Tag *
                  </label>
                  <select
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/90 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-bold text-amber-950"
                  >
                    <option value="">-- Select Category Tag --</option>
                    {PRESET_TAGS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                    <option value="Other">Custom Category...</option>
                  </select>
                </div>

                {tag === 'Other' && (
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-amber-950 mb-1.5">
                      Custom Tag Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., GOLDEN RIPENING"
                      value={customTag}
                      onChange={(e) => setCustomTag(e.target.value.toUpperCase())}
                      className="w-full px-4 py-2.5 rounded-2xl bg-white/90 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-bold text-amber-950 uppercase"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-amber-950 mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="1, 2, 3..."
                    value={orderNum}
                    onChange={(e) => setOrderNum(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white/90 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-bold text-amber-950"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-amber-950 mb-1.5">
                  Photo Caption & Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe what's happening in this photo (e.g. Traditional Rajasthan desert apiaries situated amidst seasonal flora...)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white/90 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs font-medium text-amber-950 placeholder-amber-700/40"
                ></textarea>
              </div>

              {/* Submit / Reset Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
                >
                  <span>{isSubmitting ? '⏳ Saving...' : editId ? '💾 Update Photo' : '📸 Add Photo to Gallery'}</span>
                </button>

                {editId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-5 py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

          </div>
        </form>
      </div>

      {/* Existing Gallery Photos Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black text-amber-950 font-heading">
            Live Apiary Photos ({items.length})
          </h3>
          <button
            onClick={fetchGallery}
            className="text-xs font-bold text-amber-800 hover:text-amber-950 underline flex items-center gap-1"
          >
            <span>🔄</span> Refresh List
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 honey-glass rounded-3xl border border-amber-200">
            <span className="text-3xl block animate-bounce mb-2">📸</span>
            <p className="text-sm font-bold text-amber-950">Loading gallery photos from database...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 honey-glass rounded-3xl border border-amber-200">
            <span className="text-3xl block mb-2">📷</span>
            <p className="text-sm font-bold text-amber-950">No photos in the gallery yet.</p>
            <p className="text-xs text-amber-700 mt-1">Use the form above to upload your first photo!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item, idx) => (
              <div
                key={item._id}
                className="honey-glass rounded-3xl border border-amber-200/80 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Photo Thumbnail */}
                  <div className="relative h-48 w-full bg-amber-950 overflow-hidden">
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/90 backdrop-blur-md text-white font-black text-[10px] uppercase tracking-wider shadow">
                        {item.tag || 'GALLERY'}
                      </span>
                    </div>
                    <div className="absolute top-2.5 right-2.5">
                      <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-amber-200 font-bold text-[10px]">
                        #{item.orderNum !== undefined ? item.orderNum : idx + 1}
                      </span>
                    </div>
                  </div>

                  {/* Photo Info */}
                  <div className="p-4 space-y-1.5">
                    <h4 className="text-sm font-black text-amber-950 font-heading line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-amber-900/80 font-medium line-clamp-2 leading-relaxed">
                      {item.description || item.desc || 'No description provided.'}
                    </p>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-3 bg-amber-50/60 border-t border-amber-200/60 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <span>✏️</span> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id, item.title)}
                    className="py-1.5 px-3 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-bold text-xs transition-colors flex items-center justify-center gap-1"
                    title="Delete Photo"
                  >
                    <span>🗑️</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GalleryManagementSection;
