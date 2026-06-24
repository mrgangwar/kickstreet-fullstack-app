const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const User = require('../models/User');

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError('Session expired, please sign in again', 401);
    }
    throw new ApiError('Invalid or malformed token', 401);
  }
};

const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    throw new ApiError('Sign in to continue', 401);
  }

  const token = authHeader.split(' ')[1];

  const decoded = verifyToken(token);

  const user = await User.findById(decoded.id).select('-password');

  if (!user) {
    throw new ApiError('Account no longer exists', 401);
  }

  req.user = user;
  next();
});

const adminOnly = (req, _res, next) => {
  if (!req.user) {
    return next(new ApiError('Unauthorized access', 401));
  }

  if (req.user.role !== 'admin') {
    return next(new ApiError('Admin access required', 403));
  }

  next();
};

module.exports = {
  protect,
  adminOnly
};