const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const User = require('../models/User');
const { signToken } = require('../services/tokenService');

const DUPLICATE_KEY_ERROR_CODE = 11000;

const toSafeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  shippingAddress: user.shippingAddress
});

const sendAuth = (res, statusCode, user) => {
  if (!user) {
    throw new ApiError('User data missing', 500);
  }

  const safeUser = toSafeUser(user);
  const token = signToken(user);

  res.status(statusCode).json({
    success: true,
    token,
    user: safeUser
  });
};

const handleDuplicateKeyError = (error) => {
  if (error?.code === DUPLICATE_KEY_ERROR_CODE) {
    const field = Object.keys(error.keyPattern || {})[0] || 'field';
    throw new ApiError(`This ${field} is already registered`, 409);
  }

  throw error;
};

const register = asyncHandler(async (req, res) => {
  let { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    throw new ApiError('Name, email, phone, and password are required', 400);
  }

  name = name.trim();
  phone = phone.trim();

  if (password.length < 8) {
    throw new ApiError('Password must be at least 8 characters', 400);
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existing = await User.findOne({
    $or: [{ email: normalizedEmail }, { phone }]
  });

  if (existing) {
    throw new ApiError('Email or phone is already registered', 409);
  }

  let user;

  try {
    user = await User.create({
      name,
      email: normalizedEmail,
      phone,
      password
    });
  } catch (error) {
    handleDuplicateKeyError(error);
  }

  if (!user) {
    throw new ApiError('User registration failed', 500);
  }

  sendAuth(res, 201, user);
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError('Email and password are required', 400);
  }

  const normalizedEmail = email.toLowerCase().trim();

  const user = await User.findOne({
    email: normalizedEmail
  }).select('+password');

  if (!user) {
    throw new ApiError('Invalid email or password', 401);
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    throw new ApiError('Invalid email or password', 401);
  }

  sendAuth(res, 200, user);
});

const getProfile = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: toSafeUser(req.user)
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, shippingAddress } = req.body;

  if (name !== undefined) req.user.name = name;
  if (phone !== undefined) req.user.phone = phone;

  if (shippingAddress !== undefined) {
    req.user.shippingAddress = {
      ...(req.user.shippingAddress?.toObject?.() ??
        req.user.shippingAddress ??
        {}),
      ...shippingAddress
    };
  }

  try {
    await req.user.save();
  } catch (error) {
    handleDuplicateKeyError(error);
  }

  sendAuth(res, 200, req.user);
});

module.exports = {
  register,
  login,
  getProfile,
  updateProfile
};