const db = require('../models/db');
const { calculateOrderDiscounts } = require('../utils/discountEngine');

function getPagination(query) {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const requestedLimit = Number.parseInt(query.limit, 10) || 20;
  const limit = Math.min(Math.max(requestedLimit, 1), 100);
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

function roundMoney(value) {
  return Number(Number(value).toFixed(2));
}

function buildOrderFilters(query) {
  const filters = [];
  const values = [];

  if (query.search) {
    filters.push(
      `(o.order_number LIKE ? OR c.name LIKE ? OR c.email LIKE ? OR c.phone LIKE ?)`
    );
    values.push(
      `%${query.search}%`,
      `%${query.search}%`,
      `%${query.search}%`,
      `%${query.search}%`
    );
  }

  if (query.status) {
    filters.push('o.status = ?');
    values.push(query.status);
  }

  return {
    whereClause: filters.length ? `WHERE ${filters.join(' AND ')}` : '',
    values,
  };
}

async function generateOrderNumber(connection) {
  const now = new Date();
  const datePart = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('');
  const prefix = `ORD-${datePart}-`;

  const [rows] = await connection.query(
    `SELECT order_number
     FROM orders
     WHERE order_number LIKE ?
     ORDER BY order_number DESC
     LIMIT 1`,
    [`${prefix}%`]
  );

  const nextNumber =
    rows.length === 0 ? 1 : Number(rows[0].order_number.slice(-4)) + 1;

  return `${prefix}${String(nextNumber).padStart(4, '0')}`;
}

async function buildOrderTotals(connection, items, couponCode) {
  const productIds = items.map((item) => item.product_id);
  const [products] = await connection.query(
    `SELECT id, price, tax_rate
     FROM products
     WHERE id IN (?) AND is_archived = FALSE`,
    [productIds]
  );

  const productMap = new Map(products.map((product) => [product.id, product]));

  const orderItems = items.map((item) => {
    const product = productMap.get(item.product_id);

    if (!product) {
      const error = new Error(`Product ${item.product_id} was not found`);
      error.statusCode = 400;
      throw error;
    }

    const unitPrice = roundMoney(product.price);
    const taxRate = String(product.tax_rate);
    const lineTotal = roundMoney(unitPrice * item.quantity);
    const lineTax = roundMoney(lineTotal * (Number(taxRate) / 100));

    return {
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: unitPrice,
      tax_rate: taxRate,
      line_total: lineTotal,
      line_tax: lineTax,
    };
  });

  const subtotal = roundMoney(
    orderItems.reduce((sum, item) => sum + item.line_total, 0)
  );
  const taxAmount = roundMoney(
    orderItems.reduce((sum, item) => sum + item.line_tax, 0)
  );
  const discountResult = await calculateOrderDiscounts(connection, {
    orderItems,
    subtotal,
    couponCode,
  });
  const discountAmount = discountResult.discount_amount;
  const totalAmount = roundMoney(subtotal + taxAmount - discountAmount);

  return {
    orderItems,
    appliedPromotionIds: discountResult.applied_promotion_ids,
    totals: {
      subtotal,
      tax_amount: taxAmount,
      discount_amount: discountAmount,
      total_amount: totalAmount,
    },
  };
}

async function insertOrderItems(connection, orderId, orderItems) {
  const values = orderItems.map((item) => [
    orderId,
    item.product_id,
    item.quantity,
    item.unit_price,
    item.tax_rate,
    item.line_total,
  ]);

  await connection.query(
    `INSERT INTO order_items
      (order_id, product_id, quantity, unit_price, tax_rate, line_total)
     VALUES ?`,
    [values]
  );
}

async function syncOrderPromotions(connection, orderId, promotionIds) {
  await connection.query('DELETE FROM order_promotions WHERE order_id = ?', [
    orderId,
  ]);

  if (promotionIds.length === 0) {
    return;
  }

  const values = promotionIds.map((promotionId) => [orderId, promotionId]);

  await connection.query(
    `INSERT INTO order_promotions (order_id, promotion_id)
     VALUES ?`,
    [values]
  );
}

async function setTableStatus(connection, tableId, status) {
  if (!tableId) {
    return;
  }

  await connection.query('UPDATE cafe_tables SET status = ? WHERE id = ?', [
    status,
    tableId,
  ]);
}

async function fetchOrderDetails(orderId, connection = db) {
  const [orders] = await connection.query(
    `SELECT
       o.id,
       o.order_number,
       o.customer_id,
       o.user_id,
       o.payment_method_id,
       o.table_id,
       o.subtotal,
       o.tax_amount,
       o.discount_amount,
       o.total_amount,
       o.status,
       o.kds_status,
       o.created_at,
       o.updated_at,
       c.name AS customer_name,
       c.email AS customer_email,
       c.phone AS customer_phone,
       pm.name AS payment_method_name,
       pm.type AS payment_method_type,
       t.table_number,
       t.status AS table_status
     FROM orders o
     LEFT JOIN customers c ON c.id = o.customer_id
     LEFT JOIN payment_methods pm ON pm.id = o.payment_method_id
     LEFT JOIN cafe_tables t ON t.id = o.table_id
     WHERE o.id = ?
     LIMIT 1`,
    [orderId]
  );

  if (orders.length === 0) {
    return null;
  }

  const [items] = await connection.query(
    `SELECT
       oi.id,
       oi.product_id,
       p.name AS product_name,
       oi.quantity,
       oi.unit_price,
       oi.tax_rate,
       oi.line_total,
       oi.created_at
     FROM order_items oi
     INNER JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = ?
     ORDER BY oi.id ASC`,
    [orderId]
  );

  const [promotions] = await connection.query(
    `SELECT
       p.id,
       p.name,
       p.type,
       p.coupon_code,
       p.discount_type,
       p.discount_value
     FROM order_promotions op
     INNER JOIN promotions p ON p.id = op.promotion_id
     WHERE op.order_id = ?
     ORDER BY p.id ASC`,
    [orderId]
  );

  const order = orders[0];

  return {
    id: order.id,
    order_number: order.order_number,
    customer_id: order.customer_id,
    user_id: order.user_id,
    payment_method_id: order.payment_method_id,
    table_id: order.table_id,
    subtotal: order.subtotal,
    tax_amount: order.tax_amount,
    discount_amount: order.discount_amount,
    total_amount: order.total_amount,
    status: order.status,
    kds_status: order.kds_status,
    created_at: order.created_at,
    updated_at: order.updated_at,
    customer: order.customer_id
      ? {
          id: order.customer_id,
          name: order.customer_name,
          email: order.customer_email,
          phone: order.customer_phone,
        }
      : null,
    payment_method: order.payment_method_id
      ? {
          id: order.payment_method_id,
          name: order.payment_method_name,
          type: order.payment_method_type,
        }
      : null,
    table: order.table_id
      ? {
          id: order.table_id,
          table_number: order.table_number,
          status: order.table_status,
        }
      : null,
    items,
    promotions,
  };
}

async function getOrders(req, res) {
  const { page, limit, offset } = getPagination(req.query);
  const { whereClause, values } = buildOrderFilters(req.query);

  try {
    const [countRows] = await db.query(
      `SELECT COUNT(*) AS total
       FROM orders o
       LEFT JOIN customers c ON c.id = o.customer_id
       ${whereClause}`,
      values
    );

    const [orders] = await db.query(
      `SELECT
         o.id,
         o.order_number,
         o.customer_id,
         c.name AS customer_name,
         o.table_id,
         t.table_number,
         o.total_amount,
         o.status,
         o.kds_status,
         o.created_at,
         o.updated_at
       FROM orders o
       LEFT JOIN customers c ON c.id = o.customer_id
       LEFT JOIN cafe_tables t ON t.id = o.table_id
       ${whereClause}
       ORDER BY o.created_at DESC
       LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );

    return res.status(200).json({
      success: true,
      page,
      limit,
      total: countRows[0].total,
      data: orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch orders',
    });
  }
}

async function getOrderById(req, res) {
  try {
    const order = await fetchOrderDetails(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to fetch order',
    });
  }
}

async function createOrder(req, res) {
  const { customer_id, table_id, items, coupon_code } = req.body;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const orderNumber = await generateOrderNumber(connection);
    const { orderItems, appliedPromotionIds, totals } = await buildOrderTotals(
      connection,
      items,
      coupon_code
    );

    const [result] = await connection.query(
      `INSERT INTO orders
        (order_number, customer_id, user_id, table_id, subtotal, tax_amount,
         discount_amount, total_amount, status, kds_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'draft', 'to_cook')`,
      [
        orderNumber,
        customer_id || null,
        req.user.id,
        table_id || null,
        totals.subtotal,
        totals.tax_amount,
        totals.discount_amount,
        totals.total_amount,
      ]
    );

    await insertOrderItems(connection, result.insertId, orderItems);
    await syncOrderPromotions(connection, result.insertId, appliedPromotionIds);
    await setTableStatus(connection, table_id, 'occupied');

    const order = await fetchOrderDetails(result.insertId, connection);

    await connection.commit();

    return res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    await connection.rollback();

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : 'Unable to create order',
    });
  } finally {
    connection.release();
  }
}

async function updateOrder(req, res) {
  const { customer_id, table_id, items, coupon_code } = req.body;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [orders] = await connection.query(
      'SELECT id, status, table_id FROM orders WHERE id = ? LIMIT 1',
      [req.params.id]
    );

    if (orders.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (orders[0].status === 'paid') {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        message: 'Paid orders cannot be modified',
      });
    }

    const { orderItems, appliedPromotionIds, totals } = await buildOrderTotals(
      connection,
      items,
      coupon_code
    );

    await connection.query(
      `UPDATE orders
       SET customer_id = ?,
           table_id = ?,
           subtotal = ?,
           tax_amount = ?,
           discount_amount = ?,
           total_amount = ?
       WHERE id = ?`,
      [
        customer_id || null,
        table_id || null,
        totals.subtotal,
        totals.tax_amount,
        totals.discount_amount,
        totals.total_amount,
        req.params.id,
      ]
    );

    await connection.query('DELETE FROM order_items WHERE order_id = ?', [
      req.params.id,
    ]);
    await insertOrderItems(connection, req.params.id, orderItems);
    await syncOrderPromotions(connection, req.params.id, appliedPromotionIds);

    if (orders[0].table_id && orders[0].table_id !== table_id) {
      await setTableStatus(connection, orders[0].table_id, 'available');
    }

    await setTableStatus(connection, table_id, 'occupied');

    const order = await fetchOrderDetails(req.params.id, connection);

    await connection.commit();

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    await connection.rollback();

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.statusCode ? error.message : 'Unable to update order',
    });
  } finally {
    connection.release();
  }
}

async function deleteOrder(req, res) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [orders] = await connection.query(
      'SELECT id, status, table_id FROM orders WHERE id = ? LIMIT 1',
      [req.params.id]
    );

    if (orders.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (orders[0].status === 'paid') {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        message: 'Paid orders cannot be deleted',
      });
    }

    await connection.query('DELETE FROM order_promotions WHERE order_id = ?', [
      req.params.id,
    ]);
    await connection.query('DELETE FROM order_items WHERE order_id = ?', [
      req.params.id,
    ]);
    await connection.query('DELETE FROM orders WHERE id = ?', [req.params.id]);
    await setTableStatus(connection, orders[0].table_id, 'available');

    await connection.commit();

    return res.status(200).json({
      success: true,
      data: {
        id: Number(req.params.id),
        deleted: true,
      },
    });
  } catch (error) {
    await connection.rollback();

    return res.status(500).json({
      success: false,
      message: 'Unable to delete order',
    });
  } finally {
    connection.release();
  }
}

async function sendToKitchen(req, res) {
  try {
    const [orders] = await db.query(
      'SELECT id, status FROM orders WHERE id = ? LIMIT 1',
      [req.params.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (orders[0].status === 'paid') {
      return res.status(409).json({
        success: false,
        message: 'Paid orders cannot be modified',
      });
    }

    await db.query(
      `UPDATE orders
       SET kds_status = 'to_cook'
       WHERE id = ?`,
      [req.params.id]
    );

    const order = await fetchOrderDetails(req.params.id);

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Unable to send order to kitchen',
    });
  }
}

async function payOrder(req, res) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [orders] = await connection.query(
      'SELECT id, status, table_id FROM orders WHERE id = ? LIMIT 1',
      [req.params.id]
    );

    if (orders.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (orders[0].status === 'paid') {
      await connection.rollback();
      return res.status(409).json({
        success: false,
        message: 'Order is already paid',
      });
    }

    await connection.query(
      `UPDATE orders
       SET payment_method_id = ?, status = 'paid'
       WHERE id = ?`,
      [req.body.payment_method_id, req.params.id]
    );

    await setTableStatus(connection, orders[0].table_id, 'available');

    const order = await fetchOrderDetails(req.params.id, connection);

    await connection.commit();

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    await connection.rollback();

    return res.status(500).json({
      success: false,
      message: 'Unable to mark order as paid',
    });
  } finally {
    connection.release();
  }
}

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  sendToKitchen,
  payOrder,
};
