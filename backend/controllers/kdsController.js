const db = require('../models/db');

const validTransitions = {
  to_cook: ['preparing'],
  preparing: ['completed'],
  completed: [],
};

async function attachItemsToOrders(orders) {
  if (orders.length === 0) {
    return [];
  }

  const orderIds = orders.map((order) => order.order_id);
  const [items] = await db.query(
    `SELECT
       oi.order_id,
       oi.id,
       oi.product_id,
       p.name AS product_name,
       oi.quantity,
       oi.created_at
     FROM order_items oi
     INNER JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id IN (?)
     ORDER BY oi.id ASC`,
    [orderIds]
  );

  const itemsByOrderId = new Map();

  items.forEach((item) => {
    if (!itemsByOrderId.has(item.order_id)) {
      itemsByOrderId.set(item.order_id, []);
    }

    itemsByOrderId.get(item.order_id).push({
      id: item.id,
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: item.quantity,
      created_at: item.created_at,
    });
  });

  return orders.map((order) => ({
    ...order,
    items: itemsByOrderId.get(order.order_id) || [],
  }));
}

function buildKdsFilters(query) {
  const filters = [
    "(o.kds_status <> 'completed' OR o.updated_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR))",
  ];
  const values = [];

  if (query.kds_status) {
    filters.push('o.kds_status = ?');
    values.push(query.kds_status);
  }

  if (query.q) {
    filters.push(
      `(o.order_number LIKE ? OR EXISTS (
        SELECT 1
        FROM order_items search_oi
        INNER JOIN products search_p ON search_p.id = search_oi.product_id
        WHERE search_oi.order_id = o.id
          AND search_p.name LIKE ?
      ))`
    );
    values.push(`%${query.q}%`, `%${query.q}%`);
  }

  return {
    whereClause: `WHERE ${filters.join(' AND ')}`,
    values,
  };
}

async function getKdsOrders(req, res) {
  const { whereClause, values } = buildKdsFilters(req.query);

  try {
    const [orders] = await db.query(
      `SELECT
         o.id AS order_id,
         o.order_number,
         t.table_number,
         c.name AS customer_name,
         o.created_at,
         o.kds_status
       FROM orders o
       LEFT JOIN cafe_tables t ON t.id = o.table_id
       LEFT JOIN customers c ON c.id = o.customer_id
       ${whereClause}
       ORDER BY
         FIELD(o.kds_status, 'to_cook', 'preparing', 'completed'),
         o.created_at ASC`,
      values
    );

    const ordersWithItems = await attachItemsToOrders(orders);

    return res.status(200).json({
      success: true,
      data: ordersWithItems,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch kitchen orders',
    });
  }
}

async function getKdsOrderById(req, res) {
  try {
    const [orders] = await db.query(
      `SELECT
         o.id AS order_id,
         o.order_number,
         t.table_number,
         c.name AS customer_name,
         o.created_at,
         o.kds_status
       FROM orders o
       LEFT JOIN cafe_tables t ON t.id = o.table_id
       LEFT JOIN customers c ON c.id = o.customer_id
       WHERE o.id = ?
       LIMIT 1`,
      [req.params.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Kitchen order not found',
      });
    }

    const [order] = await attachItemsToOrders(orders);

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch kitchen order',
    });
  }
}

async function getKdsStats(req, res) {
  try {
    const [rows] = await db.query(
      `SELECT kds_status, COUNT(*) AS count
       FROM orders
       GROUP BY kds_status`
    );

    const stats = {
      to_cook: 0,
      preparing: 0,
      completed: 0,
    };

    rows.forEach((row) => {
      stats[row.kds_status] = row.count;
    });

    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch kitchen stats',
    });
  }
}

async function updateKdsStatus(req, res) {
  const { kds_status } = req.body;

  try {
    const [orders] = await db.query(
      'SELECT id, kds_status FROM orders WHERE id = ? LIMIT 1',
      [req.params.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Kitchen order not found',
      });
    }

    const currentStatus = orders[0].kds_status;
    const allowedNextStatuses = validTransitions[currentStatus] || [];

    if (!allowedNextStatuses.includes(kds_status)) {
      return res.status(409).json({
        success: false,
        message: `Invalid KDS status transition from ${currentStatus} to ${kds_status}`,
      });
    }

    await db.query('UPDATE orders SET kds_status = ? WHERE id = ?', [
      kds_status,
      req.params.id,
    ]);

    const [updatedOrders] = await db.query(
      `SELECT
         o.id AS order_id,
         o.order_number,
         t.table_number,
         c.name AS customer_name,
         o.created_at,
         o.kds_status
       FROM orders o
       LEFT JOIN cafe_tables t ON t.id = o.table_id
       LEFT JOIN customers c ON c.id = o.customer_id
       WHERE o.id = ?
       LIMIT 1`,
      [req.params.id]
    );

    const [order] = await attachItemsToOrders(updatedOrders);

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to update kitchen status',
    });
  }
}

module.exports = {
  getKdsOrders,
  getKdsOrderById,
  getKdsStats,
  updateKdsStatus,
};
