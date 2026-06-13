const { body, param } = require('express-validator');
const db = require('../models/db');

const hexColorPattern = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

async function categoryNameIsUnique(name, { req }) {
  const values = [name];
  let sql = 'SELECT id FROM product_categories WHERE name = ?';

  if (req.params.id) {
    sql += ' AND id <> ?';
    values.push(req.params.id);
  }

  const [categories] = await db.query(`${sql} LIMIT 1`, values);

  if (categories.length > 0) {
    throw new Error('Category name must be unique');
  }

  return true;
}

const categoryIdValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Category id must be a positive integer'),
];

const categoryBodyValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 100 })
    .withMessage('Name must be at most 100 characters')
    .bail()
    .custom(categoryNameIsUnique),
  body('color')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .matches(hexColorPattern)
    .withMessage('Color must be a valid hex code'),
];

const createCategoryValidator = categoryBodyValidator;
const updateCategoryValidator = [...categoryIdValidator, ...categoryBodyValidator];

module.exports = {
  categoryIdValidator,
  createCategoryValidator,
  updateCategoryValidator,
};
