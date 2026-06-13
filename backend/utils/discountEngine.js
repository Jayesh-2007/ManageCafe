function roundMoney(value) {
  return Number(Number(value).toFixed(2));
}

function calculateDiscount(baseAmount, promotion) {
  const discountValue = Number(promotion.discount_value);

  if (promotion.discount_type === 'percentage') {
    return roundMoney(baseAmount * (discountValue / 100));
  }

  return roundMoney(discountValue);
}

async function getActivePromotions(connection, type) {
  const [promotions] = await connection.query(
    `SELECT id, name, type, coupon_code, discount_type, discount_value,
            min_qty, min_order_amount, is_active
     FROM promotions
     WHERE type = ? AND is_active = TRUE`,
    [type]
  );

  return promotions;
}

function applyProductPromotions(orderItems, promotions) {
  const appliedPromotions = [];
  let discount = 0;

  promotions.forEach((promotion) => {
    const minQty = Number(promotion.min_qty) || 1;
    const eligibleSubtotal = orderItems
      .filter((item) => item.quantity >= minQty)
      .reduce((sum, item) => sum + Number(item.line_total), 0);

    if (eligibleSubtotal <= 0) {
      return;
    }

    const promotionDiscount = calculateDiscount(eligibleSubtotal, promotion);

    if (promotionDiscount > 0) {
      discount += promotionDiscount;
      appliedPromotions.push(promotion.id);
    }
  });

  return {
    discount: roundMoney(discount),
    appliedPromotions,
  };
}

function applyOrderPromotions(subtotal, promotions) {
  const appliedPromotions = [];
  let discount = 0;

  promotions.forEach((promotion) => {
    const minOrderAmount = Number(promotion.min_order_amount) || 0;

    if (subtotal < minOrderAmount) {
      return;
    }

    const promotionDiscount = calculateDiscount(subtotal, promotion);

    if (promotionDiscount > 0) {
      discount += promotionDiscount;
      appliedPromotions.push(promotion.id);
    }
  });

  return {
    discount: roundMoney(discount),
    appliedPromotions,
  };
}

async function getCouponPromotion(connection, couponCode) {
  if (!couponCode) {
    return null;
  }

  const [coupons] = await connection.query(
    `SELECT id, name, type, coupon_code, discount_type, discount_value,
            min_qty, min_order_amount, is_active
     FROM promotions
     WHERE type = 'coupon'
       AND coupon_code = ?
       AND is_active = TRUE
     LIMIT 1`,
    [couponCode]
  );

  return coupons[0] || null;
}

async function calculateOrderDiscounts(connection, { orderItems, subtotal, couponCode }) {
  const productPromotions = await getActivePromotions(connection, 'product_promo');
  const orderPromotions = await getActivePromotions(connection, 'order_promo');

  const productResult = applyProductPromotions(orderItems, productPromotions);
  const orderResult = applyOrderPromotions(subtotal, orderPromotions);

  let couponDiscount = 0;
  const appliedPromotions = [
    ...productResult.appliedPromotions,
    ...orderResult.appliedPromotions,
  ];

  const coupon = await getCouponPromotion(connection, couponCode);

  if (coupon) {
    const minOrderAmount = Number(coupon.min_order_amount) || 0;

    if (subtotal >= minOrderAmount) {
      couponDiscount = calculateDiscount(subtotal, coupon);

      if (couponDiscount > 0) {
        appliedPromotions.push(coupon.id);
      }
    }
  } else if (couponCode) {
    const error = new Error('Invalid or inactive coupon code');
    error.statusCode = 400;
    throw error;
  }

  const totalDiscount = roundMoney(
    productResult.discount + orderResult.discount + couponDiscount
  );

  return {
    discount_amount: Math.min(totalDiscount, subtotal),
    applied_promotion_ids: [...new Set(appliedPromotions)],
  };
}

async function validateCouponDiscount(connection, couponCode, subtotal) {
  const coupon = await getCouponPromotion(connection, couponCode);

  if (!coupon) {
    const error = new Error('Invalid or inactive coupon code');
    error.statusCode = 404;
    throw error;
  }

  const minOrderAmount = Number(coupon.min_order_amount) || 0;

  if (subtotal < minOrderAmount) {
    const error = new Error('Coupon minimum order amount is not met');
    error.statusCode = 400;
    throw error;
  }

  const discount = Math.min(calculateDiscount(subtotal, coupon), subtotal);

  return {
    discount: roundMoney(discount),
    final_total: roundMoney(subtotal - discount),
  };
}

module.exports = {
  calculateOrderDiscounts,
  validateCouponDiscount,
};
