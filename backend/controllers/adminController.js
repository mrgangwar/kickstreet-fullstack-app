const asyncHandler = require('../utils/asyncHandler');
const Product = require('../models/Product');
const Order = require('../models/Order');

const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalProducts,
    totalOrders,
    pendingOrders,
    deliveredOrders,
    revenueResult
  ] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    Order.countDocuments({
      orderStatus: { $in: ['Processing', 'Shipped'] }
    }),
    Order.countDocuments({ orderStatus: 'Delivered' }),
    Order.aggregate([
      {
        $match: { orderStatus: 'Delivered' }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$amountTotal' }
        }
      }
    ])
  ]);

  const totalRevenue =
    revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

  res.json({
    success: true,
    stats: {
      totalProducts,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalRevenue
    }
  });
});

const getAnalytics = asyncHandler(async (req, res) => {
  const analytics = await Order.aggregate([
    {
      $match: {
        orderStatus: 'Delivered'
      }
    },
    {
      $group: {
        _id: { $month: '$createdAt' },
        revenue: { $sum: '$amountTotal' },
        orders: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  const months = [
    '', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const formattedAnalytics = analytics.map((item) => ({
    month: months[item._id],
    revenue: item.revenue,
    orders: item.orders
  }));

  res.json({
    success: true,
    analytics: formattedAnalytics
  });
});

module.exports = {
  getDashboardStats,
  getAnalytics
};