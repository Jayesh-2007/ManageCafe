const db = require('../models/db');

function getPagination(query) {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const requestedLimit = Number.parseInt(query.limit, 10) || 20;
  const limit = Math.min(Math.max(requestedLimit, 1), 100);
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

function buildProductFilters(query) {
  const filters = ['p.is_archived = FALSE'];
  const values = [];

  if (query.search) {
    filters.push('p.name LIKE ?');
    values.push(`%${query.search}%`);
  }

  if (query.category_id) {
    filters.push('p.category_id = ?');
    values.push(Number(query.category_id));
  }

  return {
    whereClause: filters.length ? `WHERE ${filters.join(' AND ')}` : '',
    values,
  };
}

async function getProducts(req, res) {
  const { page, limit, offset } = getPagination(req.query);
  const { whereClause, values } = buildProductFilters(req.query);

  try {
    const [countRows] = await db.query(
      `SELECT COUNT(*) AS total
       FROM products p
       ${whereClause}`,
      values
    );

    const [products] = await db.query(
      `SELECT
         p.id,
         p.name,
         p.category_id,
         c.name AS category_name,
         p.price,
         p.tax_rate,
         p.description,
         p.is_archived,
         p.created_at,
         p.updated_at
       FROM products p
       INNER JOIN product_categories c ON c.id = p.category_id
       ${whereClause}
       ORDER BY p.name ASC
       LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );

    return res.status(200).json({
      success: true,
      page,
      limit,
      total: countRows[0].total,
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch products',
    });
  }
}

async function getProductById(req, res) {
  try {
    const [products] = await db.query(
      `SELECT
         p.id,
         p.name,
         p.category_id,
         c.name AS category_name,
         p.price,
         p.tax_rate,
         p.description,
         p.is_archived,
         p.created_at,
         p.updated_at
       FROM products p
       INNER JOIN product_categories c ON c.id = p.category_id
       WHERE p.id = ? AND p.is_archived = FALSE
       LIMIT 1`,
      [req.params.id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: products[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch product',
    });
  }
}

async function createProduct(req, res) {
  const { name, category_id, price, tax_rate, description } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO products
        (name, category_id, price, tax_rate, description, is_archived)
       VALUES (?, ?, ?, ?, ?, FALSE)`,
      [name, category_id, price, tax_rate, description || null]
    );

    const [products] = await db.query(
      `SELECT
         p.id,
         p.name,
         p.category_id,
         c.name AS category_name,
         p.price,
         p.tax_rate,
         p.description,
         p.is_archived,
         p.created_at,
         p.updated_at
       FROM products p
       INNER JOIN product_categories c ON c.id = p.category_id
       WHERE p.id = ?`,
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      data: products[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to create product',
    });
  }
}

async function updateProduct(req, res) {
  const { name, category_id, price, tax_rate, description } = req.body;

  try {
    const [result] = await db.query(
      `UPDATE products
       SET name = ?,
           category_id = ?,
           price = ?,
           tax_rate = ?,
           description = ?
       WHERE id = ? AND is_archived = FALSE`,
      [name, category_id, price, tax_rate, description || null, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const [products] = await db.query(
      `SELECT
         p.id,
         p.name,
         p.category_id,
         c.name AS category_name,
         p.price,
         p.tax_rate,
         p.description,
         p.is_archived,
         p.created_at,
         p.updated_at
       FROM products p
       INNER JOIN product_categories c ON c.id = p.category_id
       WHERE p.id = ?`,
      [req.params.id]
    );

    return res.status(200).json({
      success: true,
      data: products[0],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to update product',
    });
  }
}

async function archiveProduct(req, res) {
  try {
    const [result] = await db.query(
      `UPDATE products
       SET is_archived = TRUE
       WHERE id = ? AND is_archived = FALSE`,
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        id: Number(req.params.id),
        is_archived: true,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to archive product',
    });
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  archiveProduct,
};
