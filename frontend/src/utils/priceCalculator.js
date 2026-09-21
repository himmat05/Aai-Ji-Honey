export const DISCOUNT_PERCENTAGE = 10;
export const PLATFORM_FEE_RATE = 0.0199; // 1.99%
export const GST_ON_FEE_RATE = 0.18;    // 18% GST on platform fee

/**
 * Calculate full pricing breakdown for an order
 * @param {number} unitPrice - Product price per unit
 * @param {number} quantity - Quantity ordered
 * @returns {Object} Pricing details
 */
export const calculateOrderPrice = (unitPrice, quantity = 1) => {
  const qty = Math.max(1, parseInt(quantity, 10) || 1);
  const originalPrice = (parseFloat(unitPrice) || 0) * qty;
  const discountAmount = originalPrice * (DISCOUNT_PERCENTAGE / 100);
  const basePrice = originalPrice - discountAmount;

  const platformFee = basePrice * PLATFORM_FEE_RATE;
  const gstOnFee = platformFee * GST_ON_FEE_RATE;
  const surcharge = platformFee + gstOnFee;

  // Free delivery policy:
  const deliveryCharges = 0;

  const totalInRupees = Math.round(basePrice + surcharge + deliveryCharges);
  const amountInPaise = Math.round((basePrice + surcharge + deliveryCharges) * 100);

  return {
    quantity: qty,
    originalPrice,
    discountAmount,
    basePrice,
    platformFee,
    gstOnFee,
    surcharge,
    deliveryCharges,
    totalInRupees,
    amountInPaise,
  };
};
