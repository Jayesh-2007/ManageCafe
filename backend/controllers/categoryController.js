const db = require('../models/db');

async function getCategories(req, res) {
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
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch categories',
    });
  }
}

async function getCategoryById(req, res) {
  try {
    const [categories] = await db.query(
      `SELECT id, name, color, created_at
       FROM product_categories
       WHERE id = ?
       LIMIT 1`,
      [req.params.id]
    );

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: categories[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch category',
    });
  }
}

async function createCategory(req, res) {
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
    return res.status(500).json({
      success: false,
      message: 'Unable to create category',
    });
  }
}

async function updateCategory(req, res) {
  const { name, color } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE product_categories
       SET name = ?, color = ?
       WHERE id = ?`,
      [name, color || null, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
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
    return res.status(500).json({
      success: false,
      message: 'Unable to update category',
    });
  }
}

async function deleteCategory(req, res) {
  try {
    const [products] = await db.query(
      'SELECT id FROM products WHERE category_id = ? LIMIT 1',
      [req.params.id]
    );

    if (products.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Category is in use and cannot be deleted',
      });
    }

    const [result] = await db.query(
      'DELETE FROM product_categories WHERE id = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
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
      message: 'Unable to delete category',
    });
  }
}

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
