const db = require('../models/db');
const { validateCouponDiscount } = require('../utils/discountEngine');

async function getPromotions(req, res) {
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
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch promotions',
    });
  }
}

async function getPromotionById(req, res) {
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
      return res.status(404).json({
        success: false,
        message: 'Promotion not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: promotions[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch promotion',
    });
  }
}

async function createPromotion(req, res) {
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
    return res.status(500).json({
      success: false,
      message: 'Unable to create promotion',
    });
  }
}

async function updatePromotion(req, res) {
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
      return res.status(404).json({
        success: false,
        message: 'Promotion not found',
      });
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
    return res.status(500).json({
      success: false,
      message: 'Unable to update promotion',
    });
  }
}

async function deletePromotion(req, res) {
  try {
    await db.query('DELETE FROM order_promotions WHERE promotion_id = ?', [
      req.params.id,
    ]);

    const [result] = await db.query('DELETE FROM promotions WHERE id = ?', [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Promotion not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: Number(req.params.id),
        deleted: true,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to delete promotion',
    });
  }
}

async function validatePromotionCoupon(req, res) {
  const { coupon_code, subtotal } = req.body;

  try {
    const data = await validateCouponDiscount(db, coupon_code, Number(subtotal));

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : 'Unable to validate coupon',
    });
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
