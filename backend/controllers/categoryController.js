const db = require('../models/db');
const AppError = require('../utils/AppError');

async function getCategories(req, res, next) {
  try {
    const [categories] = await db.query(
      `SELECT id, name, color, created_at
       FROM product_categories
       ORDER BY name ASC`
    );

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return next(error);
  }
}

async function getCategoryById(req, res, next) {
  try {
    const [categories] = await db.query(
      `SELECT id, name, color, created_at
       FROM product_categories
       WHERE id = ?
       LIMIT 1`,
      [req.params.id]
    );

    if (categories.length === 0) {
      return next(new AppError('Category not found', 404));
    }

    return res.status(200).json({
      success: true,
      data: categories[0],
    });
  } catch (error) {
    return next(error);
  }
}

async function createCategory(req, res, next) {
  const { name, color } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO product_categories (name, color)
       VALUES (?, ?)`,
      [name, color || null]
    );

    const [categories] = await db.query(
      `SELECT id, name, color, created_at
       FROM product_categories
       WHERE id = ?`,
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      data: categories[0],
    });
  } catch (error) {
    return next(error);
  }
}

async function updateCategory(req, res, next) {
  const { name, color } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE product_categories
       SET name = ?, color = ?
       WHERE id = ?`,
      [name, color || null, req.params.id]
    );

    if (result.affectedRows === 0) {
      return next(new AppError('Category not found', 404));
    }

    const [categories] = await db.query(
      `SELECT id, name, color, created_at
       FROM product_categories
       WHERE id = ?`,
      [req.params.id]
    );

    return res.status(200).json({
      success: true,
      data: categories[0],
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const [products] = await db.query(
      'SELECT id FROM products WHERE category_id = ? LIMIT 1',
      [req.params.id]
    );

    if (products.length > 0) {
      return next(new AppError('Category is in use and cannot be deleted', 409));
    }

    const [result] = await db.query(
      'DELETE FROM product_categories WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return next(new AppError('Category not found', 404));
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

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
