/**
 * Global Error Handling Middleware
 * Ensures standardized JSON response contracts across all backend routes.
 */

function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: `Resource not found: ${req.method} ${req.originalUrl}`,
    code: 'NOT_FOUND',
    timestamp: new Date().toISOString()
  });
}

function errorHandler(err, req, res, next) {
  console.error(`[Error] Unhandled exception on ${req.method} ${req.originalUrl}:`, err.stack || err.message);

  const statusCode = err.status || err.statusCode || 500;
  const response = {
    success: false,
    error: err.message || 'An unexpected internal server error occurred.',
    code: err.code || 'INTERNAL_SERVER_ERROR',
    timestamp: new Date().toISOString()
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

module.exports = {
  notFoundHandler,
  errorHandler
};
