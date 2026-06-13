const { body, param, query } = require('express-validator');
const db = require('../models/db');

async function emailIsUnique(email, { req }) {
  if (!email) {
    return true;
  }

  const values = [email];
  let sql = 'SELECT id FROM customers WHERE email = ?';

  if (req.params.id) {
    sql += ' AND id <> ?';
    values.push(req.params.id);
  }

  const [customers] = await db.query(`${sql} LIMIT 1`, values);

  if (customers.length > 0) {
    throw new Error('Email must be unique');
  }

  return true;
}

async function phoneIsUnique(phone, { req }) {
  const values = [phone];
  let sql = 'SELECT id FROM customers WHERE phone = ?';

  if (req.params.id) {
    sql += ' AND id <> ?';
    values.push(req.params.id);
  }

  const [customers] = await db.query(`${sql} LIMIT 1`, values);

  if (customers.length > 0) {
    throw new Error('Phone must be unique');
  }

  return true;
}

const customerIdValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Customer id must be a positive integer'),
];

const customerListValidator = [
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
];

const customerBodyValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name must be at most 100 characters'),
  body('email')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isEmail()
    .withMessage('Email must be valid')
    .bail()
    .normalizeEmail()
    .custom(emailIsUnique),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is required')
    .matches(/^\d{10}$/)
    .withMessage('Phone must be exactly 10 digits')
    .bail()
    .custom(phoneIsUnique),
];

const createCustomerValidator = customerBodyValidator;
const updateCustomerValidator = [...customerIdValidator, ...customerBodyValidator];

module.exports = {
  customerIdValidator,
  customerListValidator,
  createCustomerValidator,
  updateCustomerValidator,
};
