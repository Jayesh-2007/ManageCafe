const { body, param, query } = require('express-validator');
const db = require('../models/db');

async function customerExists(customerId) {
  if (!customerId) {
    return true;
  }

  const [customers] = await db.query(
    'SELECT id FROM customers WHERE id = ? LIMIT 1',
    [customerId]
  );

  if (customers.length === 0) {
    throw new Error('Customer must exist');
  }

  return true;
}

async function tableExists(tableId) {
  if (!tableId) {
    return true;
  }

  const [tables] = await db.query(
    'SELECT id FROM cafe_tables WHERE id = ? LIMIT 1',
    [tableId]
  );

  if (tables.length === 0) {
    throw new Error('Table must exist');
  }

  return true;
}

async function productExists(productId) {
  const [products] = await db.query(
    'SELECT id FROM products WHERE id = ? AND is_archived = FALSE LIMIT 1',
    [productId]
  );

  if (products.length === 0) {
    throw new Error('Product must exist');
  }

  return true;
}

async function paymentMethodExists(paymentMethodId) {
  const [paymentMethods] = await db.query(
    'SELECT id FROM payment_methods WHERE id = ? AND is_active = TRUE LIMIT 1',
    [paymentMethodId]
  );

  if (paymentMethods.length === 0) {
    throw new Error('Payment method must exist and be active');
  }

  return true;
}

const orderIdValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Order id must be a positive integer'),
];

const orderListValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('search')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search must be at most 100 characters'),
  query('status')
    .optional()
    .isIn(['draft', 'paid'])
    .withMessage('Status must be draft or paid'),
];

const orderBodyValidator = [
  body('customer_id')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage('Customer id must be a positive integer')
    .bail()
    .custom(customerExists),
  body('table_id')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 1 })
    .withMessage('Table id must be a positive integer')
    .bail()
    .custom(tableExists),
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('items.*.product_id')
    .isInt({ min: 1 })
    .withMessage('Product id must be a positive integer')
    .bail()
    .custom(productExists),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),
];

const createOrderValidator = orderBodyValidator;
const updateOrderValidator = [...orderIdValidator, ...orderBodyValidator];

const payOrderValidator = [
  ...orderIdValidator,
  body('payment_method_id')
    .isInt({ min: 1 })
    .withMessage('Payment method id must be a positive integer')
    .bail()
    .custom(paymentMethodExists),
];

module.exports = {
  orderIdValidator,
  orderListValidator,
  createOrderValidator,
  updateOrderValidator,
  payOrderValidator,
};
