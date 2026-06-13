const db = require('../models/db');
const { validateCouponDiscount } = require('../utils/discountEngine');
const AppError = require('../utils/AppError');

async function getPromotions(req, res, next) {
  try {
    const [promotions] = await db.query(
      `SELECT id, name, type, coupon_code, discount_type, discount_value,
              min_qty, min_order_amount, is_active, created_at
       FROM promotions
       ORDER BY created_at DESC`
    );

    return res.status(200).json({
      success: true,
      data: promotions,
    });
  } catch (error) {
    return next(error);
  }
}

async function getPromotionById(req, res, next) {
  try {
    const [promotions] = await db.query(
      `SELECT id, name, type, coupon_code, discount_type, discount_value,
              min_qty, min_order_amount, is_active, created_at
       FROM promotions
       WHERE id = ?
       LIMIT 1`,
      [req.params.id]
    );

    if (promotions.length === 0) {
      return next(new AppError('Promotion not found', 404));
    }

    return res.status(200).json({
      success: true,
      data: promotions[0],
    });
  } catch (error) {
    return next(error);
  }
}

async function createPromotion(req, res, next) {
  const {
    name,
    type,
    coupon_code,
    discount_type,
    discount_value,
    min_qty,
    min_order_amount,
    is_active,
  } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO promotions
        (name, type, coupon_code, discount_type, discount_value,
         min_qty, min_order_amount, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        type,
        coupon_code || null,
        discount_type,
        discount_value,
        min_qty || null,
        min_order_amount || null,
        is_active !== undefined ? is_active : true,
      ]
    );

    const [promotions] = await db.query(
      `SELECT id, name, type, coupon_code, discount_type, discount_value,
              min_qty, min_order_amount, is_active, created_at
       FROM promotions
       WHERE id = ?`,
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      data: promotions[0],
    });
  } catch (error) {
    return next(error);
  }
}

async function updatePromotion(req, res, next) {
  const {
    name,
    type,
    coupon_code,
    discount_type,
    discount_value,
    min_qty,
    min_order_amount,
    is_active,
  } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE promotions
       SET name = ?,
           type = ?,
           coupon_code = ?,
           discount_type = ?,
           discount_value = ?,
           min_qty = ?,
           min_order_amount = ?,
           is_active = ?
       WHERE id = ?`,
      [
        name,
        type,
        coupon_code || null,
        discount_type,
        discount_value,
        min_qty || null,
        min_order_amount || null,
        is_active !== undefined ? is_active : true,
        req.params.id,
      ]
    );

    if (result.affectedRows === 0) {
      return next(new AppError('Promotion not found', 404));
    }

    const [promotions] = await db.query(
      `SELECT id, name, type, coupon_code, discount_type, discount_value,
              min_qty, min_order_amount, is_active, created_at
       FROM promotions
       WHERE id = ?`,
      [req.params.id]
    );

    return res.status(200).json({
      success: true,
      data: promotions[0],
    });
  } catch (error) {
    return next(error);
  }
}

async function deletePromotion(req, res, next) {
  try {
    await db.query('DELETE FROM order_promotions WHERE promotion_id = ?', [
      req.params.id,
    ]);

    const [result] = await db.query('DELETE FROM promotions WHERE id = ?', [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return next(new AppError('Promotion not found', 404));
    }

    return res.status(200).json({
      success: true,
      data: {
        id: Number(req.params.id),
        deleted: true,
      },
    });
  } catch (error) {
    return next(error);
  }
}

async function validatePromotionCoupon(req, res, next) {
  const { coupon_code, subtotal } = req.body;

  try {
    const data = await validateCouponDiscount(db, coupon_code, Number(subtotal));

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
  validatePromotionCoupon,
};
