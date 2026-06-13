const { body, param, query } = require('express-validator');
const db = require('../models/db');

async function productNameIsUnique(name, { req }) {
  const values = [name];
  let sql = 'SELECT id FROM products WHERE name = ?';

  if (req.params.id) {
    sql += ' AND id <> ?';
    values.push(req.params.id);
  }

  const [products] = await db.query(`${sql} LIMIT 1`, values);

  if (products.length > 0) {
    throw new Error('Product name must be unique');
  }

  return true;
}

async function categoryExists(categoryId) {
  const [categories] = await db.query(
    'SELECT id FROM product_categories WHERE id = ? LIMIT 1',
    [categoryId]
  );

  if (categories.length === 0) {
    throw new Error('Category must exist');
  }

  return true;
}

const productIdValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Product id must be a positive integer'),
];

const productListValidator = [
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
  query('category_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Category filter must be a positive integer'),
];

const productBodyValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 255 })
    .withMessage('Name must be at most 255 characters')
    .bail()
    .custom(productNameIsUnique),
  body('category_id')
    .isInt({ min: 1 })
    .withMessage('Category id must be a positive integer')
    .bail()
    .custom(categoryExists),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be a positive number'),
  body('tax_rate')
    .isIn(['5', '18', '28'])
    .withMessage('Tax rate must be one of 5, 18, or 28'),
  body('description')
    .optional({ nullable: true, checkFalsy: true })
    .trim(),
];

const createProductValidator = productBodyValidator;
const updateProductValidator = [...productIdValidator, ...productBodyValidator];

module.exports = {
  productIdValidator,
  productListValidator,
  createProductValidator,
  updateProductValidator,
};
