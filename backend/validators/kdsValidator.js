const { body, param, query } = require('express-validator');

const allowedKdsStatuses = ['to_cook', 'preparing', 'completed'];

const kdsIdValidator = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Kitchen order id must be a positive integer'),
];

const kdsListValidator = [
  query('kds_status')
    .optional()
    .isIn(allowedKdsStatuses)
    .withMessage('KDS status must be to_cook, preparing, or completed'),
  query('q')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search query must be at most 100 characters'),
];

const updateKdsStatusValidator = [
  ...kdsIdValidator,
  body('kds_status')
    .notEmpty()
    .withMessage('KDS status is required')
    .isIn(allowedKdsStatuses)
    .withMessage('KDS status must be to_cook, preparing, or completed'),
];

module.exports = {
  kdsIdValidator,
  kdsListValidator,
  updateKdsStatusValidator,
};
