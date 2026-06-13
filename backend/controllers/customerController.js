const db = require('../models/db');
const AppError = require('../utils/AppError');

function getPagination(query) {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const requestedLimit = Number.parseInt(query.limit, 10) || 20;
  const limit = Math.min(Math.max(requestedLimit, 1), 100);
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

function buildCustomerFilters(query) {
  const filters = [];
  const values = [];

  if (query.search) {
    filters.push('(name LIKE ? OR email LIKE ? OR phone LIKE ?)');
    values.push(`%${query.search}%`, `%${query.search}%`, `%${query.search}%`);
  }

  return {
    whereClause: filters.length ? `WHERE ${filters.join(' AND ')}` : '',
    values,
  };
}

async function getCustomers(req, res, next) {
  const { page, limit, offset } = getPagination(req.query);
  const { whereClause, values } = buildCustomerFilters(req.query);

  try {
    const [countRows] = await db.query(
      `SELECT COUNT(*) AS total
       FROM customers
       ${whereClause}`,
      values
    );

    const [customers] = await db.query(
      `SELECT id, name, email, phone, created_at, updated_at
       FROM customers
       ${whereClause}
       ORDER BY name ASC
       LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );

    return res.status(200).json({
      success: true,
      page,
      limit,
      total: countRows[0].total,
      data: customers,
    });
  } catch (error) {
    return next(error);
  }
}

async function getCustomerById(req, res, next) {
  try {
    const [customers] = await db.query(
      `SELECT id, name, email, phone, created_at, updated_at
       FROM customers
       WHERE id = ?
       LIMIT 1`,
      [req.params.id]
    );

    if (customers.length === 0) {
      return next(new AppError('Customer not found', 404));
    }

    return res.status(200).json({
      success: true,
      data: customers[0],
    });
  } catch (error) {
    return next(error);
  }
}

async function createCustomer(req, res, next) {
  const { name, phone } = req.body;
  const email = req.body.email || null;

  try {
    const [result] = await db.query(
      `INSERT INTO customers (name, email, phone)
       VALUES (?, ?, ?)`,
      [name, email, phone]
    );

    const [customers] = await db.query(
      `SELECT id, name, email, phone, created_at, updated_at
       FROM customers
       WHERE id = ?`,
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      data: customers[0],
    });
  } catch (error) {
    return next(error);
  }
}

async function updateCustomer(req, res, next) {
  const { name, phone } = req.body;
  const email = req.body.email || null;

  try {
    const [result] = await db.query(
      `UPDATE customers
       SET name = ?, email = ?, phone = ?
       WHERE id = ?`,
      [name, email, phone, req.params.id]
    );

    if (result.affectedRows === 0) {
      return next(new AppError('Customer not found', 404));
    }

    const [customers] = await db.query(
      `SELECT id, name, email, phone, created_at, updated_at
       FROM customers
       WHERE id = ?`,
      [req.params.id]
    );

    return res.status(200).json({
      success: true,
      data: customers[0],
    });
  } catch (error) {
    return next(error);
  }
}

async function deleteCustomer(req, res, next) {
  try {
    const [orders] = await db.query(
      'SELECT id FROM orders WHERE customer_id = ? LIMIT 1',
      [req.params.id]
    );

    if (orders.length > 0) {
      return next(
        new AppError('Customer is linked to orders and cannot be deleted', 409)
      );
    }

    const [result] = await db.query('DELETE FROM customers WHERE id = ?', [
      req.params.id,
    ]);

    if (result.affectedRows === 0) {
      return next(new AppError('Customer not found', 404));
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
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
