const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  getDashboardStats,
  getAnalytics
} = require('../controllers/adminController');

const router = express.Router();

router.get('/dashboard', protect, adminOnly, getDashboardStats);
router.get('/analytics', protect, adminOnly, getAnalytics);

module.exports = router;