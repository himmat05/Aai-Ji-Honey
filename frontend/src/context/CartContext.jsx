import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import useAuth from '../hooks/useAuth';
import { cartApi } from '../api/cartApi';

const CartContext = createContext(null);

const GUEST_CART_STORAGE_KEY = 'aai_ji_guest_cart';
const GUEST_SAVED_STORAGE_KEY = 'aai_ji_guest_saved';
const COUPON_STORAGE_KEY = 'aai_ji_applied_coupon';

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  const [cartData, setCartData] = useState({
    items: [],
    savedForLater: [],
    itemCount: 0,
    subtotal: 0,
    productDiscount: 0,
    couponDiscount: 0,
    appliedCoupon: null,
    couponError: null,
    shipping: 0,
    freeShippingThreshold: 999,
    freeShippingRemaining: 999,
    tax: 0,
    gstPercentage: 5,
    total: 0,
    isValidForCheckout: false,
  });

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState(null);
  const [couponCode, setCouponCode] = useState(() => localStorage.getItem(COUPON_STORAGE_KEY) || '');

  // Separate temporary Buy Now state that leaves the persistent cart 100% untouched
  const [buyNowItem, setBuyNowItem] = useState(null);


  /**
   * Refresh / Sync Cart from server
   * Authenticated user cart fetched directly from Neon PostgreSQL
   */
  const refreshCart = useCallback(
    async (activeCoupon = couponCode) => {
      setLoading(true);
      try {
        if (isAuthenticated) {
          // Clear any legacy guest storage
          localStorage.removeItem(GUEST_CART_STORAGE_KEY);
          localStorage.removeItem(GUEST_SAVED_STORAGE_KEY);

          // Fetch authenticated server cart
          const res = await cartApi.getCart(activeCoupon);
          if (res?.data) {
            setCartData(res.data);
          }
        } else {
          // Unauthenticated user: strictly empty cart state
          localStorage.removeItem(GUEST_CART_STORAGE_KEY);
          localStorage.removeItem(GUEST_SAVED_STORAGE_KEY);
          setCartData({
            items: [],
            savedForLater: [],
            itemCount: 0,
            subtotal: 0,
            productDiscount: 0,
            couponDiscount: 0,
            appliedCoupon: null,
            couponError: null,
            shipping: 0,
            freeShippingThreshold: 999,
            freeShippingRemaining: 999,
            tax: 0,
            gstPercentage: 5,
            total: 0,
            isValidForCheckout: false,
          });
        }
      } catch (err) {
        console.error('Failed refreshing cart:', err);
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, couponCode]
  );

  // Sync cart when authentication changes
  useEffect(() => {
    refreshCart();
  }, [isAuthenticated, refreshCart]);

  /**
   * Add Item to Cart
   * Strictly requires user to be logged in
   */
  const addToCart = async (product, quantity = 1, openDrawer = true) => {
    if (!product) return;

    if (!isAuthenticated) {
      toast.warn('Please sign in or create an account to add items to your cart.');
      const currentPath = window.location.pathname || '/products';
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      return false;
    }

    const pId = product._id || product.id;
    const cleanQty = Math.max(1, parseInt(quantity, 10) || 1);
    const availableStock = parseInt(product.stock, 10) ?? 50;

    if (availableStock <= 0) {
      toast.error(`Sorry, ${product.name} is currently out of stock.`);
      return false;
    }

    setActionLoading(true);

    try {
      // Authenticated: Persist to NeonDB via Cart API
      const res = await cartApi.addItem({
        productId: pId,
        quantity: cleanQty,
        coupon: couponCode,
      });

      if (res?.data) {
        setCartData(res.data);
        const addedItem = res.data.items.find((i) => i.productId === pId);
        setLastAddedItem(addedItem || product);
        toast.success(`🍯 Added ${cleanQty} × ${product.name} to cart!`);
        if (openDrawer) setIsDrawerOpen(true);
        return true;
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      const errMsg = err.response?.data?.message || err.message || 'Could not add product to cart.';
      toast.error(errMsg);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const quantityDebounceRef = useRef({});
  const [couponLoading, setCouponLoading] = useState(false);

  /**
   * Update Quantity of an Item
   * Highly responsive: updates local state in 0ms, then syncs with backend in background
   */
  const updateQuantity = (productId, newQuantity) => {
    if (!isAuthenticated) {
      toast.warn('Please log in to manage your cart.');
      return;
    }

    const qty = parseInt(newQuantity, 10);
    if (isNaN(qty)) return;

    if (qty <= 0) {
      return removeFromCart(productId);
    }

    // 1. Instant Optimistic UI Update (0ms)
    setCartData((prev) => {
      const targetItem = prev.items.find((i) => i.productId === productId);
      if (!targetItem) return prev;

      const availableStock = targetItem.stock || 50;
      const finalQty = Math.max(1, Math.min(availableStock, qty));

      const newItems = prev.items.map((i) => {
        if (i.productId === productId) {
          return {
            ...i,
            quantity: finalQty,
            itemSubtotal: i.price * finalQty,
          };
        }
        return i;
      });

      const newSubtotal = newItems.reduce((acc, i) => acc + (i.isAvailable ? i.itemSubtotal : 0), 0);
      const newItemCount = newItems.reduce((acc, i) => acc + (i.isAvailable ? i.quantity : 0), 0);

      let couponDisc = 0;
      if (prev.appliedCoupon) {
        couponDisc = Math.round(newSubtotal * (Number(prev.appliedCoupon.discount_percentage) / 100));
      }

      const taxable = Math.max(0, newSubtotal - couponDisc);
      const newShipping = newSubtotal === 0 || newSubtotal >= 999 ? 0 : 50;
      const newTax = Math.round(taxable * 0.05);
      const newTotal = taxable + newShipping + newTax;

      return {
        ...prev,
        items: newItems,
        itemCount: newItemCount,
        subtotal: newSubtotal,
        couponDiscount: couponDisc,
        shipping: newShipping,
        tax: newTax,
        total: newTotal,
      };
    });

    // 2. Debounced background sync
    if (quantityDebounceRef.current[productId]) {
      clearTimeout(quantityDebounceRef.current[productId]);
    }

    quantityDebounceRef.current[productId] = setTimeout(async () => {
      try {
        const res = await cartApi.updateQuantity(productId, qty, couponCode);
        if (res?.data) {
          setCartData(res.data);
        }
      } catch (err) {
        console.error('Error updating quantity:', err);
        const errMsg = err.response?.data?.message || 'Failed to update quantity';
        toast.error(errMsg);
        refreshCart();
      }
    }, 200);
  };

  /**
   * Remove Item from Cart
   * Instant UI response with background sync
   */
  const removeFromCart = async (productId) => {
    if (!isAuthenticated) {
      toast.warn('Please log in to manage your cart.');
      return;
    }

    // Optimistic instant removal
    setCartData((prev) => {
      const newItems = prev.items.filter((i) => i.productId !== productId);
      const newSubtotal = newItems.reduce((acc, i) => acc + (i.isAvailable ? i.itemSubtotal : 0), 0);
      const newItemCount = newItems.reduce((acc, i) => acc + (i.isAvailable ? i.quantity : 0), 0);

      let couponDisc = 0;
      if (prev.appliedCoupon) {
        couponDisc = Math.round(newSubtotal * (Number(prev.appliedCoupon.discount_percentage) / 100));
      }

      const taxable = Math.max(0, newSubtotal - couponDisc);
      const newShipping = newSubtotal === 0 || newSubtotal >= 999 ? 0 : 50;
      const newTax = Math.round(taxable * 0.05);
      const newTotal = taxable + newShipping + newTax;

      return {
        ...prev,
        items: newItems,
        itemCount: newItemCount,
        subtotal: newSubtotal,
        couponDiscount: couponDisc,
        shipping: newShipping,
        tax: newTax,
        total: newTotal,
      };
    });

    toast.info('Item removed from cart');

    try {
      const res = await cartApi.removeItem(productId, couponCode);
      if (res?.data) {
        setCartData(res.data);
      }
    } catch (err) {
      console.error('Error removing item:', err);
      toast.error('Failed to remove item');
      refreshCart();
    }
  };

  /**
   * Clear entire cart
   */
  const clearCart = async () => {
    if (!isAuthenticated) return;

    setActionLoading(true);
    try {
      const res = await cartApi.clearCart();
      if (res?.data) {
        setCartData(res.data);
      }
      toast.info('Cart cleared');
    } catch (err) {
      console.error('Error clearing cart:', err);
      toast.error('Failed to clear cart');
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Move item from Cart to Saved for Later
   */
  const saveForLater = async (productId) => {
    if (!isAuthenticated) {
      toast.warn('Please log in to save items for later.');
      return;
    }

    setActionLoading(true);
    try {
      const res = await cartApi.saveForLater(productId, couponCode);
      if (res?.data) {
        setCartData(res.data);
        toast.info('Moved to Saved for Later');
      }
    } catch (err) {
      console.error('Error saving for later:', err);
      toast.error('Failed to save item for later');
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Move item from Saved for Later back to Cart
   */
  const moveToCart = async (productId) => {
    if (!isAuthenticated) {
      toast.warn('Please log in to move items to cart.');
      return;
    }

    setActionLoading(true);
    try {
      const res = await cartApi.moveToCart(productId, couponCode);
      if (res?.data) {
        setCartData(res.data);
        toast.success('Moved back to Cart');
      }
    } catch (err) {
      console.error('Error moving to cart:', err);
      const errMsg = err.response?.data?.message || 'Failed to move to cart';
      toast.error(errMsg);
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Remove item from Saved for Later
   */
  const removeSavedItem = async (productId) => {
    if (!isAuthenticated) return;

    setActionLoading(true);
    try {
      const res = await cartApi.removeSavedItem(productId, couponCode);
      if (res?.data) {
        setCartData(res.data);
        toast.info('Removed from Saved for Later');
      }
    } catch (err) {
      console.error('Error removing saved item:', err);
      toast.error('Failed to remove saved item');
    } finally {
      setActionLoading(false);
    }
  };

  /**
   * Apply Coupon Code
   */
  const applyCoupon = async (code) => {
    if (!isAuthenticated) {
      toast.warn('Please sign in to apply coupon codes.');
      return;
    }

    const trimmed = String(code || '').trim().toUpperCase();
    if (!trimmed) {
      toast.warn('Please enter a coupon code.');
      return;
    }
    setCouponLoading(true);
    setCouponCode(trimmed);
    localStorage.setItem(COUPON_STORAGE_KEY, trimmed);

    try {
      const res = await cartApi.getCart(trimmed);
      if (res?.data) {
        setCartData(res.data);
        if (res.data.appliedCoupon) {
          toast.success(`🎉 Coupon ${res.data.appliedCoupon.code} applied! Saved ₹${res.data.couponDiscount}`);
        } else if (res.data.couponError) {
          toast.error(res.data.couponError);
        }
      }
    } catch (err) {
      toast.error('Failed to apply coupon.');
    } finally {
      setCouponLoading(false);
    }
  };

  /**
   * Remove Coupon Code
   * Instant UI response (0ms)
   */
  const removeCoupon = async () => {
    setCouponCode('');
    localStorage.removeItem(COUPON_STORAGE_KEY);

    // Optimistic instant UI update
    setCartData((prev) => {
      const sub = prev.subtotal;
      const tax = Math.round(sub * 0.05);
      const ship = sub === 0 || sub >= 999 ? 0 : 50;
      return {
        ...prev,
        appliedCoupon: null,
        couponDiscount: 0,
        couponError: null,
        tax,
        total: sub + ship + tax,
      };
    });

    toast.info('Coupon removed');

    try {
      const res = await cartApi.getCart('');
      if (res?.data) {
        setCartData(res.data);
      }
    } catch (err) {
      console.error('Error syncing cart after coupon removal:', err);
    }
  };

  /**
   * Buy Now Action
   * Sets temporary checkout session for single product without affecting the persistent cart.
   * Prompts login if not authenticated.
   */
  const buyNow = (product, quantity = 1) => {
    if (!product) return;

    if (!isAuthenticated) {
      toast.warn('Please sign in or create an account to proceed with your order.');
      const currentPath = window.location.pathname || '/products';
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      return false;
    }

    const cleanQty = Math.max(1, parseInt(quantity, 10) || 1);
    const availableStock = parseInt(product.stock, 10) ?? 50;

    if (availableStock <= 0) {
      toast.error(`Sorry, ${product.name} is currently out of stock.`);
      return false;
    }

    if (cleanQty > availableStock) {
      toast.error(`Only ${availableStock} units available for ${product.name}.`);
      return false;
    }

    setBuyNowItem({
      product: {
        _id: product._id || product.id,
        id: product._id || product.id,
        name: product.name,
        price: parseFloat(product.price) || 0,
        originalPrice: product.originalPrice || Math.round((parseFloat(product.price) || 0) * 1.25),
        image: product.image,
        flavour: product.flavour || 'Raw Blossom',
        stock: availableStock,
      },
      quantity: cleanQty,
    });
    return true;
  };

  const clearBuyNowItem = () => {
    setBuyNowItem(null);
  };

  const value = {
    cart: cartData,
    items: cartData.items,
    savedForLater: cartData.savedForLater,
    itemCount: cartData.itemCount,
    subtotal: cartData.subtotal,
    productDiscount: cartData.productDiscount,
    couponDiscount: cartData.couponDiscount,
    appliedCoupon: cartData.appliedCoupon,
    couponError: cartData.couponError,
    shipping: cartData.shipping,
    freeShippingThreshold: cartData.freeShippingThreshold,
    freeShippingRemaining: cartData.freeShippingRemaining,
    tax: cartData.tax,
    total: cartData.total,
    isValidForCheckout: cartData.isValidForCheckout,
    changes: cartData.changes,
    loading,
    actionLoading,
    couponLoading,
    isDrawerOpen,
    setIsDrawerOpen,
    lastAddedItem,
    couponCode,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    saveForLater,
    moveToCart,
    removeSavedItem,
    applyCoupon,
    removeCoupon,
    refreshCart,
    buyNow,
    buyNowItem,
    clearBuyNowItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
