import asyncHandler from 'express-async-handler';
import Order from '../models/Order.model.js';
import Cart from '../models/Cart.model.js';
import Product from '../models/Product.model.js';

// @desc  Create order
// @route POST /api/orders
export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod, stripePaymentIntentId } = req.body;
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart || cart.items.length === 0) { res.status(400); throw new Error('Cart is empty'); }

  const items = cart.items.map((i) => ({
    product: i.product._id,
    name: i.product.name,
    image: i.product.images[0] || '',
    quantity: i.quantity,
    color: i.color,
    size: i.size,
    price: i.price,
  }));

  const itemsPrice = cart.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const deliveryCharges = cart.items.reduce((acc, i) => acc + (i.product.deliveryCharges || 0), 0);
  const totalPrice = itemsPrice + deliveryCharges;

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    paymentMethod,
    stripePaymentIntentId: stripePaymentIntentId || undefined,
    paymentStatus: paymentMethod === 'stripe' ? 'paid' : 'pending',
    itemsPrice,
    deliveryCharges,
    totalPrice,
    statusHistory: [{ status: 'pending', note: 'Order placed' }],
  });

  // Update product sold counts & decrement stock
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: { soldCount: item.quantity, stock: -item.quantity },
    });
  }

  // Clear cart
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

  res.status(201).json({ success: true, order });
});

// @desc  Get user orders
// @route GET /api/orders/my-orders
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('items.product', 'name images')
    .populate('rider', 'name avatar phone')
    .sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

// @desc  Get single order
// @route GET /api/orders/:id
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email avatar')
    .populate('items.product', 'name images')
    .populate('rider', 'name avatar phone');
  if (!order) { res.status(404); throw new Error('Order not found'); }
  res.json({ success: true, order });
});

// @desc  Admin: Get all orders
// @route GET /api/orders
export const getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = status ? { status } : {};
  const skip = (Number(page) - 1) * Number(limit);
  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('user', 'name email avatar')
    .populate('rider', 'name avatar')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));
  res.json({ success: true, orders, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

// @desc  Admin: Update order status
// @route PATCH /api/orders/:id/status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  
  order.status = status;
  order.statusHistory.push({ status, note: note || '' });

  // Auto-complete COD payment status to paid upon successful delivery
  if (status === 'delivered' && order.paymentMethod && order.paymentMethod.toLowerCase() === 'cod') {
    order.paymentStatus = 'paid';
  }

  await order.save();
  res.json({ success: true, order });
});

// @desc  Admin: Assign rider to order
// @route PATCH /api/orders/:id/assign-rider
export const assignRider = asyncHandler(async (req, res) => {
  const { riderId } = req.body;
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { rider: riderId, status: 'assigned', $push: { statusHistory: { status: 'assigned', note: 'Rider assigned' } } },
    { new: true }
  ).populate('rider', 'name avatar phone');
  if (!order) { res.status(404); throw new Error('Order not found'); }
  res.json({ success: true, order });
});

// @desc  Rider: Get assigned orders
// @route GET /api/orders/rider-orders
export const getRiderOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ rider: req.user._id })
    .populate('user', 'name email avatar phone')
    .populate('items.product', 'name images')
    .sort({ createdAt: -1 });
  res.json({ success: true, orders });
});
