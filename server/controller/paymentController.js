const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// @desc    Create Razorpay Order for GPay / PhonePe / Cards / UPI
// @route   POST /api/payment/create-order
// @access  Private
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid payment amount' });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return res.status(500).json({ message: 'Payment gateway is not configured. Contact admin.' });
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const options = {
      amount: Math.round(amount * 100), // paise
      currency: 'INR',
      receipt: `canteen_rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    res.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      keyId,
    });
  } catch (error) {
    console.error('Razorpay order creation failed:', error.message);
    res.status(502).json({ message: 'Payment gateway error. Please try again.' });
  }
};

// @desc    Verify Razorpay Signature & Create Paid Canteen Order
// @route   POST /api/payment/verify
// @access  Private
exports.verifyPaymentAndCreateOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      notes,
    } = req.body;

    // All three fields are mandatory — no demo bypass
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: '❌ Missing payment credentials. Payment not verified.' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items provided in order' });
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return res.status(500).json({ message: 'Server payment config error. Contact admin.' });
    }

    // ALWAYS verify cryptographic SHA256 HMAC signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        message: '❌ Payment signature mismatch. This order was NOT paid. Contact support.',
      });
    }

    // Signature OK — calculate total from DB prices (prevents client-side price tampering)
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) {
        return res.status(404).json({ message: `Item not found: ${item.menuItem}` });
      }
      if (!menuItem.available) {
        return res.status(400).json({ message: `${menuItem.name} is currently out of stock` });
      }

      totalAmount += menuItem.price * item.quantity;
      orderItems.push({
        menuItem: menuItem._id,
        quantity: item.quantity,
        price: menuItem.price,
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      paymentStatus: 'paid',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      status: 'pending',
      notes: notes || '',
    });

    const populatedOrder = await Order.findById(order._id)
      .populate('items.menuItem', 'name price image category');

    res.status(201).json({
      message: '✅ Payment Verified! Order sent to Canteen Admin.',
      paymentId: razorpay_payment_id,
      order: populatedOrder,
    });
  } catch (error) {
    console.error('Payment verification error:', error.message);
    res.status(500).json({ message: error.message });
  }
};
