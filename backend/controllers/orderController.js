const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const Order = require('../models/Order');
const {
  buildOrderFromCart,
  decrementStock
} = require('../services/orderService');

const ORDER_STATUS_TRANSITIONS = {
  Processing: ['Shipped', 'Cancelled'],
  Shipped: ['Delivered', 'Returned'],
  Delivered: ['Returned'],
  Cancelled: [],
  Returned: []
};

const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError('At least one item is required to place an order', 400);
  }

  if (
    !shippingAddress?.line1 ||
    !shippingAddress?.city ||
    !shippingAddress?.state ||
    !shippingAddress?.postalCode ||
    !shippingAddress?.phone
  ) {
    throw new ApiError('Complete shipping address is required', 400);
  }

  const session = await mongoose.startSession();

  try {
    let createdOrder;

    await session.withTransaction(async () => {
      const { orderItems, amountTotal } = await buildOrderFromCart(items, {
        session
      });

      await decrementStock(orderItems, { session });

      const [order] = await Order.create(
        [
          {
            user: req.user._id,
            email: req.user.email,
            items: orderItems,
            amountTotal,
            shippingAddress,
            paymentMethod: 'cod'
          }
        ],
        { session }
      );

      createdOrder = order;
    });

    res.status(201).json({
      success: true,
      order: createdOrder
    });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error.message || 'Failed to place order', 400);
  } finally {
    session.endSession();
  }
});

const getMyOrders = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);

  const [orders, total] = await Promise.all([
    Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

    Order.countDocuments({ user: req.user._id })
  ]);

  res.json({
    success: true,
    orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

const getAllOrders = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 100);

  const [orders, total] = await Promise.all([
    Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

    Order.countDocuments({})
  ]);

  res.json({
    success: true,
    orders,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError('Order not found', 404);
  }

  const isOwner = order.user.toString() === req.user._id.toString();

  if (!isOwner && req.user.role !== 'admin') {
    throw new ApiError('You do not have permission to view this order', 403);
  }

  res.json({
    success: true,
    order
  });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    throw new ApiError('Order not found', 404);
  }

  const { orderStatus, trackingId } = req.body;

  const allowed = [
    'Processing',
    'Shipped',
    'Delivered',
    'Cancelled',
    'Returned'
  ];

  if (!allowed.includes(orderStatus)) {
    throw new ApiError('Invalid order status', 400);
  }

  const permittedNextStatuses =
    ORDER_STATUS_TRANSITIONS[order.orderStatus] || [];

  if (
    orderStatus !== order.orderStatus &&
    !permittedNextStatuses.includes(orderStatus)
  ) {
    throw new ApiError(
      `Cannot transition order from '${order.orderStatus}' to '${orderStatus}'`,
      400
    );
  }

  order.orderStatus = orderStatus;
  order.trackingId = trackingId ?? order.trackingId;

  if (orderStatus === 'Delivered' && !order.deliveredAt) {
    order.deliveredAt = new Date();
    order.paymentStatus = 'Paid'; // COD delivered => paid
    order.paidAt = new Date();
  }

  await order.save();

  res.json({
    success: true,
    order
  });
});

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus
};