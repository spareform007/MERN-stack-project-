import Order from '../models/Order.js';
import User from '../models/User.js';

// @desc Create new order & earn Mae' Club loyalty points
// @route POST /api/orders
export const createOrder = async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    discountAmount,
    pointsRedeemed,
    totalPrice
  } = req.body;

  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: 'No luxury order items provided' });
  }

  try {
    // Calculate earned loyalty points (e.g. 10 points per dollar spent)
    const pointsEarned = Math.floor(totalPrice * 10);

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      discountAmount,
      pointsRedeemed,
      totalPrice,
      pointsEarned,
      isPaid: true,
      paidAt: Date.now(),
      status: 'Order Placed'
    });

    const createdOrder = await order.save();

    // Update user's loyalty points balance
    const user = await User.findById(req.user._id);
    if (user) {
      user.loyaltyPoints = Math.max(0, user.loyaltyPoints - (pointsRedeemed || 0)) + pointsEarned;
      if (user.loyaltyPoints > 5000) user.loyaltyTier = 'Noir VIP';
      else if (user.loyaltyPoints > 1000) user.loyaltyTier = 'Gold';
      await user.save();
    }

    res.status(201).json({ createdOrder, pointsEarned });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get logged-in user orders
// @route GET /api/orders/myorders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get order by ID
// @route GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update order status (Admin)
// @route PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all orders (Admin)
// @route GET /api/orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
