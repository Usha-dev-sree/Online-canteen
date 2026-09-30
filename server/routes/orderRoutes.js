const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} = require('../controller/orderController');
const { protect, adminOnly } = require('../middleware/auth');

// User routes (authenticated)
router.post('/', protect, createOrder);
router.get('/my', protect, getMyOrders);

// Admin routes
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
