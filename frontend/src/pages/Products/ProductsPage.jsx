import React, { useEffect, useState, useMemo } from 'react';
import { productApi } from '../../api/productApi';
import ProductCard from './components/ProductCard';
import OrderModal from './components/OrderModal';
import AuthModal from '../../components/common/AuthModal';
import useAuth from '../../hooks/useAuth';

const ProductsPage = () => {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingProduct, setPendingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFlavour, setSelectedFlavour] = useState('ALL');
  const [priceRange, setPriceRange] = useState('ALL'); // ALL, UNDER_400, 400_700, ABOVE_700
  const [sortBy, setSortBy] = useState('FEATURED'); // FEATURED, PRICE_ASC, PRICE_DESC, NAME_ASC
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productApi.getProducts();
      setProducts(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Unable to load products. Please check back soon.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Dynamically extract all unique flavours from existing products
  const availableFlavours = useMemo(() => {
    const list = [];
    products.forEach((p) => {
      const f = p.flavour?.trim();
      if (f && !list.includes(f)) {
        list.push(f);
      }
    });
    return list;
  }, [products]);

  // Combined filtering and sorting
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search query across name, description, and flavour
        const query = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !query ||
          p.name?.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.flavour?.toLowerCase().includes(query);

        if (!matchesSearch) return false;

        // Flavour filter
        if (selectedFlavour !== 'ALL') {
          const prodFlavour = p.flavour?.toLowerCase() || '';
          const target = selectedFlavour.toLowerCase();
          if (!prodFlavour.includes(target)) {
            return false;
          }
        }

        // Price filter
        const price = Number(p.price) || 0;
        if (priceRange === 'UNDER_400' && price >= 400) return false;
        if (priceRange === '400_700' && (price < 400 || price > 700)) return false;
        if (priceRange === 'ABOVE_700' && price <= 700) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'PRICE_ASC') return (Number(a.price) || 0) - (Number(b.price) || 0);
        if (sortBy === 'PRICE_DESC') return (Number(b.price) || 0) - (Number(a.price) || 0);
        if (sortBy === 'NAME_ASC') return a.name.localeCompare(b.name);
        return 0; // default featured
      });
  }, [products, searchQuery, selectedFlavour, priceRange, sortBy]);

  const hasActiveFilters = selectedFlavour !== 'ALL' || priceRange !== 'ALL' || searchQuery !== '' || sortBy !== 'FEATURED';

  const resetFilters = () => {
    setSelectedFlavour('ALL');
    setPriceRange('ALL');
    setSortBy('FEATURED');
    setSearchQuery('');
  };

  return (
    <div className="w-full min-h-[85vh] relative pb-24 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-8 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full honey-glass border border-amber-300 shadow-sm">
            <span className="text-sm animate-bounce">🍯</span>
            <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
              100% Raw • Direct From Rajasthan Hives
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-amber-950 tracking-tight font-heading">
            Our Honey <span className="honey-gradient-text">Harvest</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-amber-900/80 leading-relaxed font-medium">
            Cold-extracted, unheated, free from corn syrups, and packed in food-safe UV glass jars with living enzymes intact.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="honey-glass rounded-3xl p-5 border border-amber-200/90 shadow-lg mb-10 max-w-5xl mx-auto space-y-4">
          
          {/* Top Row: Search + Sort */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                placeholder="Search by name, floral note, or benefit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/90 text-sm text-amber-950 placeholder-amber-800/50 border border-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xs"
              />
              <span className="absolute left-3.5 top-3 text-amber-600 text-sm">🔍</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <label className="text-xs font-bold text-amber-900 whitespace-nowrap">Sort By:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3.5 py-2 rounded-xl bg-white text-xs font-bold text-amber-950 border border-amber-300 shadow-xs focus:outline-none focus:border-amber-500"
              >
                <option value="FEATURED">✨ Featured Harvest</option>
                <option value="PRICE_ASC">💵 Price: Low to High</option>
                <option value="PRICE_DESC">💎 Price: High to Low</option>
                <option value="NAME_ASC">🔤 Name (A - Z)</option>
              </select>
            </div>
          </div>

          {/* Filter Rows: Flavour & Price */}
          <div className="pt-3 border-t border-amber-200/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Flavour Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-extrabold text-amber-900 mr-1 flex items-center gap-1">
                <span>🌼</span> Flavour:
              </span>
              <button
                onClick={() => setSelectedFlavour('ALL')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  selectedFlavour === 'ALL'
                    ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-sm'
                    : 'bg-white/80 text-amber-900 border border-amber-200 hover:bg-amber-50'
                }`}
              >
                All Flavours
              </button>

              {/* Standard Market Varieties and Dynamic flavours */}
              {Array.from(new Set([
                'Mustard',
                'Babul',
                'Berseem',
                'Multi Floral',
                'Moringa',
                'Fennel',
                'Wild Flora',
                'Ajwain',
                'Jamun',
                'Ber',
                'Tulsi',
                ...availableFlavours
              ])).map((flv) => (
                <button
                  key={flv}
                  onClick={() => setSelectedFlavour(flv)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    selectedFlavour === flv
                      ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-sm'
                      : 'bg-white/80 text-amber-900 border border-amber-200 hover:bg-amber-50'
                  }`}
                >
                  {flv}
                </button>
              ))}
            </div>

            {/* Price Filter Options */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-extrabold text-amber-900 mr-1 flex items-center gap-1">
                <span>💰</span> Price:
              </span>
              {[
                { id: 'ALL', label: 'All' },
                { id: 'UNDER_400', label: '< ₹400' },
                { id: '400_700', label: '₹400–700' },
                { id: 'ABOVE_700', label: '> ₹700' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPriceRange(p.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                    priceRange === p.id
                      ? 'bg-amber-950 text-white shadow-sm'
                      : 'bg-white/80 text-amber-900 border border-amber-200 hover:bg-amber-50'
                  }`}
                >
                  {p.label}
                </button>
              ))}

              {/* Reset button if filters active */}
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold text-red-600 hover:text-red-800 ml-2 underline"
                >
                  Reset All
                </button>
              )}
            </div>

          </div>

          {/* Filter Status summary */}
          <div className="text-xs text-amber-800/80 font-medium flex items-center justify-between pt-1">
            <span>
              Showing <strong>{filteredProducts.length}</strong> of {products.length} honey jars
            </span>
            {hasActiveFilters && (
              <span className="text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                Filters active
              </span>
            )}
          </div>

        </div>

        {/* Loading State Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-2 max-w-6xl mx-auto">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="honey-glass rounded-3xl p-6 h-[500px] border border-amber-200 animate-pulse flex flex-col justify-between"
              >
                <div className="h-[60%] bg-amber-100/60 rounded-2xl"></div>
                <div className="space-y-3 mt-4">
                  <div className="h-4 bg-amber-200/60 rounded-full w-3/4"></div>
                  <div className="h-6 bg-amber-200/60 rounded-full w-1/3"></div>
                  <div className="h-10 bg-amber-300/60 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="honey-glass border-2 border-red-200 text-red-700 p-8 rounded-3xl text-center max-w-md mx-auto shadow-xl">
            <span className="text-4xl block mb-2">⚠️</span>
            <p className="text-lg font-bold">{error}</p>
            <button
              onClick={fetchProducts}
              className="mt-5 btn-honey-primary px-6 py-2.5 text-sm uppercase tracking-wide font-bold"
            >
              🔄 Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="honey-glass rounded-3xl p-12 text-center border border-amber-200 max-w-md mx-auto shadow-xl">
            <span className="text-6xl block mb-3 animate-bounce">🍯</span>
            <h3 className="text-2xl font-black text-amber-950 font-heading">
              No varieties found
            </h3>
            <p className="text-sm text-amber-800/80 mt-2 font-medium">
              Try adjusting your search query or check back soon for our next harvest!
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 text-xs font-bold text-amber-700 underline"
              >
                Clear Search
              </button>
            )}
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-2 max-w-6xl mx-auto">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onSelect={(prod) => {
                  if (!isAuthenticated) {
                    setPendingProduct(prod);
                    setIsAuthModalOpen(true);
                  } else {
                    setSelectedProduct(prod);
                  }
                }}
              />
            ))}
          </div>
        )}

        {/* Bottom Trust Highlights */}
        <div className="mt-20 pt-8 border-t border-amber-200/80 max-w-5xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="flex items-center justify-center gap-3 p-4 honey-glass rounded-2xl">
              <span className="text-2xl">🚚</span>
              <div className="text-left">
                <h4 className="text-xs font-bold text-amber-950">Express Delivery</h4>
                <p className="text-[11px] text-amber-700">Safe doorstep delivery across India</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 honey-glass rounded-2xl">
              <span className="text-2xl">🛡️</span>
              <div className="text-left">
                <h4 className="text-xs font-bold text-amber-950">Tamper-Proof Seal</h4>
                <p className="text-[11px] text-amber-700">Eco-friendly glass jar packaging</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 honey-glass rounded-2xl">
              <span className="text-2xl">✨</span>
              <div className="text-left">
                <h4 className="text-xs font-bold text-amber-950">100% Satisfaction</h4>
                <p className="text-[11px] text-amber-700">Real raw honey taste guarantee</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Modal (Logged In) */}
        {selectedProduct && (
          <OrderModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}

        {/* Auth Modal Trigger for Guest Shoppers */}
        <AuthModal
          isOpen={isAuthModalOpen}
          subtitle="Please sign in or create an account to purchase raw Rajasthan honey"
          onClose={() => {
            setIsAuthModalOpen(false);
            setPendingProduct(null);
          }}
          onSuccess={() => {
            setIsAuthModalOpen(false);
            if (pendingProduct) {
              setSelectedProduct(pendingProduct);
              setPendingProduct(null);
            }
          }}
        />

      </div>
    </div>
  );
};

export default ProductsPage;
