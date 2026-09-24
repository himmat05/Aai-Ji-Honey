const couponService = require('../services/couponService');

/**
 * GET /api/coupons
 * Public list of active promo codes available for shoppers
 */
const getPublicCoupons = async (req, res) => {
  try {
    const coupons = await couponService.getActiveCoupons();
    res.json({
      success: true,
      coupons: coupons.map((c) => ({
        id: c.id,
        code: c.code,
        discount_percentage: c.discount_percentage,
        min_order_amount: parseFloat(c.min_order_amount) || 0,
        max_discount: c.max_discount ? parseFloat(c.max_discount) : null,
        description: c.description,
      })),
    });
  } catch (err) {
    console.error('Error fetching public coupons:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available promo codes',
      error: err.message,
    });
  }
};

/**
 * GET /api/coupons/admin
 * Admin list of all promo codes (active and inactive)
 */
const getAdminCoupons = async (req, res) => {
  try {
    const coupons = await couponService.getAllCoupons();
    res.json({
      success: true,
      coupons,
    });
  } catch (err) {
    console.error('Error fetching admin coupons:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch coupons',
      error: err.message,
    });
  }
};

/**
 * POST /api/coupons/admin
 * Admin creates a new promo code
 */
const createCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, minOrderAmount, maxDiscount, description } = req.body;

    const newCoupon = await couponService.createCoupon({
      code,
      discountPercentage,
      minOrderAmount,
      maxDiscount,
      description,
    });

    res.status(201).json({
      success: true,
      message: `Promo code "${newCoupon.code}" created successfully!`,
      coupon: newCoupon,
    });
  } catch (err) {
    console.error('Error creating coupon:', err);
    const status = err.status || 500;
    res.status(status).json({
      success: false,
      message: err.message || 'Failed to create promo code',
    });
  }
};

/**
 * DELETE /api/coupons/admin/:id
 * Admin deletes a promo code
 */
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await couponService.deleteCoupon(id);

    res.json({
      success: true,
      message: `Promo code "${deleted.code}" deleted successfully`,
      deletedId: id,
    });
  } catch (err) {
    console.error('Error deleting coupon:', err);
    const status = err.status || 500;
    res.status(status).json({
      success: false,
      message: err.message || 'Failed to delete promo code',
    });
  }
};

/**
 * PATCH /api/coupons/admin/:id/toggle
 * Admin toggles promo code active/inactive state
 */
const toggleCouponStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await couponService.toggleCouponActive(id);

    res.json({
      success: true,
      message: `Promo code "${updated.code}" is now ${updated.is_active ? 'active' : 'inactive'}`,
      coupon: updated,
    });
  } catch (err) {
    console.error('Error toggling coupon status:', err);
    const status = err.status || 500;
    res.status(status).json({
      success: false,
      message: err.message || 'Failed to toggle promo code status',
    });
  }
};

module.exports = {
  getPublicCoupons,
  getAdminCoupons,
  createCoupon,
  deleteCoupon,
  toggleCouponStatus,
};
