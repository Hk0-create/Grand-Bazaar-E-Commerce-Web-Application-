import asyncHandler from 'express-async-handler';
import Message from '../models/Message.model.js';
import Order from '../models/Order.model.js';

// @desc  Get chat messages for an order
// @route GET /api/chat/:orderId
export const getMessages = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.orderId);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  const isAuthorized =
    order.user.toString() === req.user._id.toString() ||
    (order.rider && order.rider.toString() === req.user._id.toString()) ||
    req.user.role === 'admin' || req.user.role === 'superadmin';
  if (!isAuthorized) { res.status(403); throw new Error('Not authorized'); }
  const messages = await Message.find({ order: req.params.orderId }).populate('sender', 'name avatar role');
  res.json({ success: true, messages });
});

// @desc  Send a chat message
// @route POST /api/chat/:orderId
export const sendMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const msg = await Message.create({
    order: req.params.orderId,
    sender: req.user._id,
    senderRole: req.user.role,
    message,
  });
  await msg.populate('sender', 'name avatar role');
  res.status(201).json({ success: true, message: msg });
});
