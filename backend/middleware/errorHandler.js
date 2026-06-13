const { logger } = require('../utils/logger');

function errorHandler(error, req, res, next) {
  const statusCode = error.statusCode || 500;
  const message =
    error.isOperational || statusCode < 500
      ? error.message
      : 'Internal server error';

  const response = {
    success: false,
    message,
  };

  if (error.errors) {
    response.errors = error.errors;
  }

  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  const logLevel = statusCode >= 500 ? 'error' : 'warn';

  logger[logLevel]('Request error handled', {
    message: error.message,
    statusCode,
    isOperational: Boolean(error.isOperational),
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    stack: error.stack,
    errors: error.errors,
  });

  return res.status(statusCode).json(response);
}

module.exports = errorHandler;
