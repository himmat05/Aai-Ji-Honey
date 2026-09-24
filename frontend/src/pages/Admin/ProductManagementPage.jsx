import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { productApi } from '../../api/productApi';
import { compressImage } from '../../utils/imageCompressor';

const MARKET_FLAVOURS = [
  { value: 'Mustard Blossom', label: '🌼 Mustard Blossom (सरसों का शहद)' },
  { value: 'Babul', label: '🌳 Babul / Acacia (बबूल शहद)' },
  { value: 'Berseem', label: '🌱 Berseem / Clover (बरसीम शहद)' },
  { value: 'Multi Floral', label: '🌸 Multi Floral (मल्टी फ्लोरल शहद)' },
  { value: 'Moringa', label: '🌿 Moringa / Drumstick Blossom (मोरिंगा शहद)' },
  { value: 'Fennel', label: '🌾 Fennel / Saunf (सौंफ शहद)' },
  { value: 'Wild Flora', label: '🌺 Wild Flora (जंगली फूल शहद)' },
  { value: 'Ajwain Blossom', label: '🌿 Ajwain Blossom (अजवाइन शहद)' },
  { value: 'Jamun Blossom', label: '🍇 Jamun Blossom (जामुन शहद)' },
  { value: 'Ber / Sidr', label: '🍯 Ber / Sidr (बेर का शहद)' },
  { value: 'Eucalyptus', label: '🍃 Eucalyptus (नीलगिरी शहद)' },
  { value: 'Tulsi / Holy Basil', label: '🌱 Tulsi / Holy Basil (तुलसी शहद)' },
  { value: 'Litchi Blossom', label: '🍒 Litchi Blossom (लीची शहद)' },
  { value: 'Forest Raw Comb Honey', label: '🪵 Forest Raw Comb Honey (वन शहद)' },
  { value: 'Ginger Infused', label: '🫚 Ginger Infused (अदरक शहद)' },
  { value: 'Cinnamon Infused', label: '🪵 Cinnamon Infused (दालचीनी शहद)' },
  { value: 'Other', label: '✨ Other / Custom Flavour' },
];

const ProductManagementPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [stock, setStock] = useState(50);
  const [flavour, setFlavour] = useState('Mustard Blossom');
  const [customFlavour, setCustomFlavour] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProducts = async () => {
    try {
      const data = await productApi.getProducts();
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      toast.error('Failed to load products');
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setOriginalPrice('');
    setStock(50);
    setFlavour('Mustard Blossom');
    setCustomFlavour('');
    setDescription('');
    setImage(null);
    setImagePreview('');
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      toast.error('Please enter product name and selling price.');
      return;
    }

    if (originalPrice && Number(originalPrice) <= Number(price)) {
      toast.error(`Compare-at price (₹${originalPrice}) must be greater than selling price (₹${price}).`);
      return;
    }

    if (!editId && !image) {
      toast.error('Please select an image for the new product.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('price', price);
      formData.append('stock', Math.max(0, parseInt(stock, 10) || 0));
      if (originalPrice) {
        formData.append('originalPrice', originalPrice);
      }

      const resolvedFlavour = flavour === 'Other' ? (customFlavour.trim() || 'Custom Flavour') : flavour;
      formData.append('flavour', resolvedFlavour);
      formData.append('description', description.trim());

      if (image && image instanceof File) {
        const compressed = await compressImage(image, 1400, 0.85);
        formData.append('image', compressed);
      }

      if (editId) {
        const updated = await productApi.updateProduct(editId, formData);
        setProducts((prev) => prev.map((p) => (p._id === editId ? updated : p)));
        toast.success('✅ Product updated successfully!');
      } else {
        const created = await productApi.addProduct(formData);
        setProducts((prev) => [created, ...prev]);
        toast.success('✅ Product added successfully!');
      }

      resetForm();
    } catch (err) {
      console.error('Error saving product:', err);
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setEditId(product._id);
    setName(product.name || '');
    setPrice(product.price || '');
    setOriginalPrice(product.originalPrice || '');
    setStock(product.stock !== undefined ? product.stock : 50);
    
    const existingFlavour = product.flavour || 'Mustard Blossom';
    const isPreset = MARKET_FLAVOURS.some((f) => f.value === existingFlavour);
    if (isPreset) {
      setFlavour(existingFlavour);
      setCustomFlavour('');
    } else {
      setFlavour('Other');
      setCustomFlavour(existingFlavour);
    }

    setDescription(product.description || '');
    setImage(null);
    setImagePreview(product.image || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this honey product?')) return;

    try {
      await productApi.deleteProduct(id);
      toast.success('Product deleted successfully');
      setProducts((prev) => prev.filter((p) => p._id !== id));
      if (editId === id) resetForm();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-wider mb-2">
              <span>👑</span> Admin Catalog
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-amber-950 font-heading">
              {editId ? '✏️ Edit Product' : '🍯 Product Catalog Management'}
            </h1>
            <p className="text-amber-800 text-xs sm:text-sm mt-1">
              Add new honey jars, update prices, or adjust images in the store
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
            <button
              onClick={() => navigate('/orderDashboard?tab=gallery')}
              className="px-4 py-2.5 rounded-2xl honey-glass border border-amber-300 text-amber-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-100 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span>📸</span>
              <span>Manage Gallery</span>
            </button>
            <button
              onClick={() => navigate('/orderDashboard?tab=team')}
              className="px-4 py-2.5 rounded-2xl honey-glass border border-amber-300 text-amber-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-100 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <span>👥</span>
              <span>Manage Team</span>
            </button>
            <button
              onClick={() => navigate('/orderDashboard')}
              className="btn-honey-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md"
            >
              <span>📋</span>
              <span>Dashboard</span>
            </button>
          </div>
        </div>

        {/* Product Form Card */}
        <div className="honey-glass rounded-3xl p-8 border border-amber-200/80 shadow-xl">
          <h2 className="text-xl font-black text-amber-950 font-heading mb-6">
            {editId ? 'Edit Product Details' : 'Add New Honey Product'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Product Name & Flavour */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-2">Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Raw Forest Honey (500g)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full border-2 border-amber-200 p-3 rounded-xl focus:outline-none focus:border-amber-500 transition-colors bg-amber-50/20 text-amber-950 font-medium"
                />
              </div>

              {/* Honey Flavour / Flora */}
              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-2">Honey Flavour / Flora *</label>
                <select
                  value={flavour}
                  onChange={(e) => setFlavour(e.target.value)}
                  className="w-full border-2 border-amber-200 p-3 rounded-xl focus:outline-none focus:border-amber-500 transition-colors bg-white text-amber-950 font-medium"
                >
                  {MARKET_FLAVOURS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
                {flavour === 'Other' && (
                  <input
                    type="text"
                    placeholder="e.g., Sidr Kashmir Blossom, Cardamom Infused"
                    value={customFlavour}
                    onChange={(e) => setCustomFlavour(e.target.value)}
                    required
                    className="w-full border-2 border-amber-200 p-2.5 rounded-xl focus:outline-none focus:border-amber-500 transition-colors bg-amber-50/20 mt-2 text-xs text-amber-950"
                  />
                )}
              </div>
            </div>

            {/* Row 2: Selling Price & Compare-at Price (MRP) */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Selling Price */}
              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-2">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  placeholder="e.g., 499"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="1"
                  className="w-full border-2 border-amber-200 p-3 rounded-xl focus:outline-none focus:border-amber-500 transition-colors bg-amber-50/20 font-black text-amber-950 text-lg"
                />
                <p className="text-xs text-amber-700/80 mt-1">
                  Actual selling price the customer will pay at checkout.
                </p>
              </div>

              {/* Compare-at Price (MRP) */}
              <div>
                <label className="block text-sm font-semibold text-amber-900 mb-2">
                  Compare-at Price / Actual MRP (₹) (Optional)
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g., 555"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  className={`w-full border-2 ${
                    originalPrice && Number(originalPrice) <= Number(price)
                      ? 'border-red-400 focus:border-red-500 bg-red-50/30'
                      : 'border-amber-200 focus:border-amber-500 bg-amber-50/20'
                  } p-3 rounded-xl focus:outline-none transition-colors text-amber-950 font-bold text-lg`}
                />
                {originalPrice && Number(originalPrice) <= Number(price) ? (
                  <p className="text-xs text-red-600 font-bold mt-1.5 flex items-center gap-1">
                    <span>⚠️</span>
                    <span>Compare-at price (₹{originalPrice}) must be greater than Selling Price (₹{price || 0})</span>
                  </p>
                ) : originalPrice && Number(originalPrice) > Number(price) ? (
                  <p className="text-xs text-emerald-800 font-bold mt-1.5 flex items-center gap-1.5 flex-wrap bg-emerald-50/90 p-2 rounded-lg border border-emerald-200">
                    <span>✓ Crossed out preview:</span>
                    <span className="line-through text-stone-400 font-bold">₹{originalPrice}</span>
                    <span className="font-black text-amber-950">₹{price}</span>
                    <span className="bg-emerald-200/80 text-emerald-900 px-1.5 py-0.2 rounded text-[10px] font-black">
                      Save ₹{Number(originalPrice) - Number(price)} ({Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100)}% OFF)
                    </span>
                  </p>
                ) : (
                  <p className="text-xs text-amber-700/80 mt-1">
                    Original MRP (e.g. ₹555). Will be displayed crossed out next to selling price (~~₹555~~ ₹499).
                  </p>
                )}
              </div>
            </div>

            {/* Row 3: Warehouse In-Stock Quantity */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-amber-900">
                  Warehouse In-Stock (Units) *
                </label>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    stock <= 0
                      ? 'bg-red-100 text-red-700 border border-red-300'
                      : stock < 5
                      ? 'bg-orange-100 text-orange-700 border border-orange-300 animate-pulse'
                      : 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                  }`}
                >
                  {stock <= 0
                    ? '● Out of Stock'
                    : stock < 5
                    ? `⚠️ Limited Stock (${stock})`
                    : `● In Stock (${stock})`}
                </span>
              </div>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="e.g., 50"
                value={stock}
                onChange={(e) => setStock(Math.max(0, parseInt(e.target.value, 10) || 0))}
                required
                className="w-full border-2 border-amber-200 p-3 rounded-xl focus:outline-none focus:border-amber-500 transition-colors bg-amber-50/20 text-amber-950 font-bold"
              />
              <p className="text-xs text-amber-700/80 mt-1">
                📦 Lower stock limit is 5 (shows ⚠️ Limited Stock in shop). At 0, it shows Out of Stock and blocks orders.
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                Product Description & Benefits
              </label>
              <textarea
                rows={3}
                placeholder="e.g., 100% Raw and unprocessed honey harvested directly from golden mustard fields of Rajasthan. Naturally rich in bee pollen, active enzymes, and antioxidants..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border-2 border-amber-200 p-3 rounded-xl focus:outline-none focus:border-amber-500 transition-colors bg-amber-50/20 text-amber-950"
              />
              <p className="text-xs text-amber-700/80 mt-1">
                Customers can read this on the product card and checkout modal.
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                Product Image {editId ? '(Leave unchanged to keep current image)' : '*'}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full border-2 border-dashed border-amber-300 p-4 rounded-xl cursor-pointer hover:border-amber-500 transition-colors bg-amber-50/40"
              />
              {imagePreview && (
                <div className="mt-4 flex items-center gap-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-contain rounded-xl border-2 border-amber-200 shadow-md bg-white p-2"
                  />
                  <p className="text-xs text-amber-800">
                    {image ? 'New image selected for upload' : 'Current product image'}
                  </p>
                </div>
              )}
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="flex gap-4 pt-4 border-t-2 border-amber-100">
              {editId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                >
                  Cancel Edit
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {isSubmitting
                  ? 'Saving...'
                  : editId
                  ? '💾 Update Product'
                  : '➕ Save and Publish Product'}
              </button>
            </div>
          </form>
        </div>

        {/* Products Grid */}
        <div>
          <h2 className="text-2xl font-bold text-amber-950 mb-6 flex items-center gap-2">
            <span>📦</span> Current Store Products ({products.length})
          </h2>

          {products.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border-2 border-amber-200 shadow-md">
              <p className="text-xl text-amber-800 font-semibold">No products in catalog yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => (
                <div
                  key={prod._id}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-amber-100 flex flex-col justify-between"
                >
                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 h-60 flex items-center justify-center p-4 relative">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-contain rounded-xl"
                    />
                    <span className="absolute top-3 left-3 bg-amber-500/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow backdrop-blur-sm">
                      🌼 {prod.flavour || 'Wild Flora'}
                    </span>
                    <span className="absolute top-3 right-3 bg-white/95 text-amber-950 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm border border-amber-200">
                      {prod.ratingCount > 0 && prod.avgRating > 0 ? (
                        <>⭐ {prod.avgRating} ({prod.ratingCount} {prod.ratingCount === 1 ? 'review' : 'reviews'})</>
                      ) : (
                        <span className="text-stone-500">☆ No ratings yet</span>
                      )}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            (prod.stock ?? 50) <= 0
                              ? 'bg-red-100 text-red-700 border border-red-300'
                              : (prod.stock ?? 50) < 5
                              ? 'bg-orange-100 text-orange-700 border border-orange-300 animate-pulse'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                        >
                          {(prod.stock ?? 50) <= 0
                            ? '● Out of Stock (0)'
                            : (prod.stock ?? 50) < 5
                            ? `⚠️ Limited Stock (${prod.stock})`
                            : `● In Stock (${prod.stock})`}
                        </span>
                        {prod.originalPrice > prod.price && (
                          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            {Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100)}% OFF
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-lg text-amber-950 mb-1">{prod.name}</h3>
                      <p className="text-xs text-amber-800/90 line-clamp-2 mb-3">
                        {prod.description || '100% Pure, raw unpasteurized honey.'}
                      </p>
                      <div className="flex items-baseline gap-2 mb-4">
                        <p className="text-2xl font-black text-amber-700 font-heading">₹{prod.price}</p>
                        {prod.originalPrice > prod.price && (
                          <span className="text-xs text-gray-400 line-through">₹{prod.originalPrice}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(prod)}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold rounded-xl text-sm transition-all shadow"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDelete(prod._id)}
                        className="flex-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 font-semibold rounded-xl text-sm transition-all border border-red-200"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManagementPage;
