const { validationResult } = require('express-validator');
const AppError = require('../utils/AppError');

function validateRequest(req, res, next) {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const error = new AppError('Validation failed', 400);
  error.errors = errors.array().map((validationError) => ({
    field: validationError.path,
    message: validationError.msg,
  }));

  return next(error);
}

module.exports = validateRequest;
