const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const crypto = require('crypto');

// @desc    Create a new order (Submitted ONLY after successful payment)
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { items, notes, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    // Validate items and calculate total from DB prices
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) {
        return res.status(404).json({ message: `Menu item not found: ${item.menuItem}` });
      }
      if (!menuItem.available) {
        return res.status(400).json({ message: `${menuItem.name} is currently unavailable` });
      }

      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;

      orderItems.push({
        menuItem: menuItem._id,
        quantity: item.quantity,
        price: menuItem.price,
      });
    }

    // Order created after successful payment -> paymentStatus is 'paid', status is 'pending' (sent to Admin first)
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      paymentStatus: 'paid',
      status: 'pending',
      notes: notes || '',
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('items.menuItem', 'name price image category');

    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged-in user's orders
// @route   GET /api/orders/my
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.menuItem', 'name price image category')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (admin) — only paid orders sent for admin confirmation first
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status, paymentStatus: 'paid' } : { paymentStatus: 'paid' };

    const orders = await Order.find(filter)
      .populate('user', 'name email phone')
      .populate('items.menuItem', 'name price image category')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (Admin accepts order first & generates 6-digit Pickup Code)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;

    // Automatically generate 6-digit Pickup Code when order is ACCEPTED by admin
    if (['confirmed', 'preparing', 'ready'].includes(status) && !order.pickupCode) {
      const randomCode = crypto.randomBytes(3).toString('hex').toUpperCase();
      order.pickupCode = `#${randomCode}`;
    }

    await order.save();

    const updatedOrder = await Order.findById(order._id)
      .populate('user', 'name email phone')
      .populate('items.menuItem', 'name price image category');

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
