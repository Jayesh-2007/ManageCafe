const { body, param } = require('express-validator');
const db = require('../models/db');

async function couponCodeIsUnique(couponCode, { req }) {
  if (!couponCode) {
    return true;
  }

  const values = [couponCode];
  let sql = 'SELECT id FROM promotions WHERE coupon_code = ?';

  if (req.params.id) {
    sql += ' AND id <> ?';
    values.push(req.params.id);
  }

  const [promotions] = await db.query(`${sql} LIMIT 1`, values);

  if (promotions.length > 0) {
    throw new Error('Coupon code must be unique');
  }

  return true;
}

function validatePromotionShape(value, { req }) {
  if (value === 'coupon' && !req.body.coupon_code) {
    throw new Error('Coupon code is required for coupon promotions');
  }

  if (value === 'product_promo' && !req.body.min_qty) {
    throw new Error('Minimum quantity is required for product promotions');
  }

  if (
    value === 'order_promo' &&
    (req.body.min_order_amount === undefined || req.body.min_order_amount === null)
  ) {
    throw new Error('Minimum order amount is required for order promotions');
  }

  return true;
}

const promotionIdValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Promotion id must be a positive integer'),
];

const promotionBodyValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Promotion name is required')
    .isLength({ max: 150 })
    .withMessage('Promotion name must be at most 150 characters'),
  body('type')
    .isIn(['coupon', 'product_promo', 'order_promo'])
    .withMessage('Promotion type must be coupon, product_promo, or order_promo')
    .bail()
    .custom(validatePromotionShape),
  body('coupon_code')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 80 })
    .withMessage('Coupon code must be at most 80 characters')
    .bail()
    .custom(couponCodeIsUnique),
  body('discount_type')
    .isIn(['percentage', 'fixed'])
    .withMessage('Discount type must be percentage or fixed'),
  body('discount_value')
    .isFloat({ gt: 0 })
    .withMessage('Discount must be positive')
    .bail()
    .custom((value, { req }) => {
      if (req.body.discount_type === 'percentage' && Number(value) > 100) {
        throw new Error('Percentage discount must be at most 100');
      }

      return true;
    }),
  body('min_qty')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage('Minimum quantity must be at least 1'),
  body('min_order_amount')
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Minimum order amount cannot be negative'),
  body('is_active')
    .optional()
    .isBoolean()
    .withMessage('is_active must be true or false'),
];

const createPromotionValidator = promotionBodyValidator;
const updatePromotionValidator = [...promotionIdValidator, ...promotionBodyValidator];

const validateCouponValidator = [
  body('coupon_code')
    .trim()
    .notEmpty()
    .withMessage('Coupon code is required')
    .isLength({ max: 80 })
    .withMessage('Coupon code must be at most 80 characters'),
  body('subtotal')
    .isFloat({ gt: 0 })
    .withMessage('Subtotal must be a positive number'),
];

module.exports = {
  promotionIdValidator,
  createPromotionValidator,
  updatePromotionValidator,
  validateCouponValidator,
};
