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

  return res.status(statusCode).json(response);
}

module.exports = errorHandler;
