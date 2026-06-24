const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (err, req, res, _next) => {
  console.error('ERROR STACK:', err?.stack || err);

  let statusCode = err.statusCode || err.status || 500;

  if (typeof statusCode !== 'number' || statusCode < 100 || statusCode > 599) {
    statusCode = 500;
  }

  // Mongoose Cast Error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(404).json({
      success: false,
      message: 'Resource not found'
    });
  }

  // Duplicate key error (MongoDB unique fields)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    return res.status(409).json({
      success: false,
      message: `${field} already exists`
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const fieldErrors = Object.entries(err.errors).map(([field, item]) => ({
      field,
      message: item.message
    }));

    return res.status(400).json({
      success: false,
      message: fieldErrors.map((e) => e.message).join(', '),
      errors: fieldErrors
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }

  // Body parser JSON error
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Malformed JSON in request body'
    });
  }

  const isServerError = statusCode >= 500;

  const message =
    isServerError && process.env.NODE_ENV === 'production'
      ? 'Something went wrong. Please try again later.'
      : err.message || 'Something went wrong';

  return res.status(statusCode).json({
    success: false,
    message
  });
};

module.exports = {
  notFound,
  errorHandler
};