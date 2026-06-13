const db = require('../models/db');

function buildDateFilter(query, alias = 'o') {
  const filters = [`${alias}.status = 'paid'`];
  const values = [];

  if (query.startDate) {
    filters.push(`DATE(${alias}.created_at) >= ?`);
    values.push(query.startDate);
  }

  if (query.endDate) {
    filters.push(`DATE(${alias}.created_at) <= ?`);
    values.push(query.endDate);
  }

  return {
    whereClause: `WHERE ${filters.join(' AND ')}`,
    values,
  };
}

function escapeCsvValue(value) {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value);

  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

function toCsv(rows) {
  const headers = [
    'order_number',
    'order_date',
    'customer_name',
    'total_amount',
    'payment_method',
  ];
  const lines = [headers.join(',')];

  rows.forEach((row) => {
    lines.push(
      headers.map((header) => escapeCsvValue(row[header])).join(',')
    );
  });

  return `${lines.join('\n')}\n`;
}

async function getSummary(req, res) {
  const { whereClause, values } = buildDateFilter(req.query);

  try {
    const [summaryRows] = await db.query(
      `SELECT
         COUNT(*) AS total_orders,
         COALESCE(SUM(o.total_amount), 0) AS total_revenue,
         COALESCE(AVG(o.total_amount), 0) AS average_order_value
       FROM orders o
       ${whereClause}`,
      values
    );

    const customerFilters = [];
    const customerValues = [];

    if (req.query.startDate) {
      customerFilters.push('DATE(created_at) >= ?');
      customerValues.push(req.query.startDate);
    }

    if (req.query.endDate) {
      customerFilters.push('DATE(created_at) <= ?');
      customerValues.push(req.query.endDate);
    }

    const customerWhere = customerFilters.length
      ? `WHERE ${customerFilters.join(' AND ')}`
      : '';
    const [customerRows] = await db.query(
      `SELECT COUNT(*) AS total_customers
       FROM customers
       ${customerWhere}`,
      customerValues
    );

    const summary = summaryRows[0];

    return res.status(200).json({
      success: true,
      data: {
        total_orders: summary.total_orders,
        total_revenue: Number(summary.total_revenue),
        average_order_value: Number(summary.average_order_value),
        total_customers: customerRows[0].total_customers,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch report summary',
    });
  }
}

async function getSalesTrend(req, res) {
  const { whereClause, values } = buildDateFilter(req.query);

  try {
    const [rows] = await db.query(
      `SELECT
         DATE(o.created_at) AS date,
         COALESCE(SUM(o.total_amount), 0) AS revenue
       FROM orders o
       ${whereClause}
       GROUP BY DATE(o.created_at)
       ORDER BY DATE(o.created_at) ASC`,
      values
    );

    return res.status(200).json({
      success: true,
      data: rows.map((row) => ({
        date: row.date,
        revenue: Number(row.revenue),
      })),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch sales trend',
    });
  }
}

async function getTopProducts(req, res) {
  const { whereClause, values } = buildDateFilter(req.query);

  try {
    const [rows] = await db.query(
      `SELECT
         p.id AS product_id,
         p.name AS product_name,
         COALESCE(SUM(oi.quantity), 0) AS quantity_sold,
         COALESCE(SUM(oi.line_total), 0) AS revenue
       FROM order_items oi
       INNER JOIN orders o ON o.id = oi.order_id
       INNER JOIN products p ON p.id = oi.product_id
       ${whereClause}
       GROUP BY p.id, p.name
       ORDER BY revenue DESC`,
      values
    );

    return res.status(200).json({
      success: true,
      data: rows.map((row) => ({
        product_id: row.product_id,
        product_name: row.product_name,
        quantity_sold: Number(row.quantity_sold),
        revenue: Number(row.revenue),
      })),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch top products',
    });
  }
}

async function getTopCategories(req, res) {
  const { whereClause, values } = buildDateFilter(req.query);

  try {
    const [rows] = await db.query(
      `SELECT
         pc.name AS category_name,
         COALESCE(SUM(oi.line_total), 0) AS revenue
       FROM order_items oi
       INNER JOIN orders o ON o.id = oi.order_id
       INNER JOIN products p ON p.id = oi.product_id
       INNER JOIN product_categories pc ON pc.id = p.category_id
       ${whereClause}
       GROUP BY pc.id, pc.name
       ORDER BY revenue DESC`,
      values
    );

    return res.status(200).json({
      success: true,
      data: rows.map((row) => ({
        category_name: row.category_name,
        revenue: Number(row.revenue),
      })),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch top categories',
    });
  }
}

async function exportReport(req, res) {
  const { whereClause, values } = buildDateFilter(req.query);

  try {
    const [rows] = await db.query(
      `SELECT
         o.order_number,
         DATE(o.created_at) AS order_date,
         c.name AS customer_name,
         o.total_amount,
         pm.name AS payment_method
       FROM orders o
       LEFT JOIN customers c ON c.id = o.customer_id
       LEFT JOIN payment_methods pm ON pm.id = o.payment_method_id
       ${whereClause}
       ORDER BY o.created_at ASC`,
      values
    );

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="cafe-pos-report.csv"'
    );

    return res.status(200).send(toCsv(rows));
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to export report',
    });
  }
}

module.exports = {
  getSummary,
  getSalesTrend,
  getTopProducts,
  getTopCategories,
  exportReport,
};
