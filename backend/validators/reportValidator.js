const { query } = require('express-validator');

function isValidDate(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));
}

function endDateIsAfterStartDate(endDate, { req }) {
  if (!req.query.startDate || !endDate) {
    return true;
  }

  if (new Date(endDate) < new Date(req.query.startDate)) {
    throw new Error('End date must be greater than or equal to start date');
  }

  return true;
}

const reportDateValidator = [
  query('startDate')
    .optional()
    .custom(isValidDate)
    .withMessage('Start date must use YYYY-MM-DD format'),
  query('endDate')
    .optional()
    .custom(isValidDate)
    .withMessage('End date must use YYYY-MM-DD format')
    .bail()
    .custom(endDateIsAfterStartDate),
];

const exportReportValidator = [
  ...reportDateValidator,
  query('format')
    .optional()
    .isIn(['csv'])
    .withMessage('Export format must be csv'),
];

module.exports = {
  reportDateValidator,
  exportReportValidator,
};
