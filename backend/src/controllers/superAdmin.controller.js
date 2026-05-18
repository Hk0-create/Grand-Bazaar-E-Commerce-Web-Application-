import asyncHandler from 'express-async-handler';
import User from '../models/User.model.js';
import Order from '../models/Order.model.js';
import Product from '../models/Product.model.js';
import Review from '../models/Review.model.js';

// @desc  Super admin: Get dashboard stats
// @route GET /api/superadmin/stats
export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ role: 'user' });
  const totalAdmins = await User.countDocuments({ role: 'admin' });
  const totalRiders = await User.countDocuments({ role: 'rider' });
  const totalProducts = await Product.countDocuments({ isApproved: true });
  const pendingProducts = await Product.countDocuments({ isApproved: false });
  const pendingAdmins = await User.countDocuments({ role: 'admin', isApproved: false });
  const pendingRiders = await User.countDocuments({ role: 'rider', isApproved: false });
  const totalOrders = await Order.countDocuments();
  const revenueResult = await Order.aggregate([
    { $match: { paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } },
  ]);
  const totalRevenue = revenueResult[0]?.total || 0;

  // Monthly sales for chart (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const monthlySales = await Order.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo }, paymentStatus: 'paid' } },
    { $group: { _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, revenue: { $sum: '$totalPrice' }, count: { $sum: 1 } } },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  // Top selling products
  const topProducts = await Product.find({ isApproved: true }).sort({ soldCount: -1 }).limit(5).select('name images soldCount sellingPrice');

  // Top buyers
  const topBuyers = await Order.aggregate([
    { $group: { _id: '$user', totalSpent: { $sum: '$totalPrice' }, orderCount: { $sum: 1 } } },
    { $sort: { totalSpent: -1 } },
    { $limit: 5 },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { 'user.name': 1, 'user.email': 1, 'user.avatar': 1, totalSpent: 1, orderCount: 1 } },
  ]);

  res.json({
    success: true,
    stats: { totalUsers, totalAdmins, totalRiders, totalProducts, pendingProducts, pendingAdmins, pendingRiders, totalOrders, totalRevenue },
    monthlySales,
    topProducts,
    topBuyers,
  });
});

// @desc  Super admin: Approve/reject product
// @route PATCH /api/superadmin/products/:id/approve
export const approveProduct = asyncHandler(async (req, res) => {
  const { approved } = req.body;
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { isApproved: approved, isActive: approved, isRejected: !approved },
    { new: true }
  );
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ success: true, product, message: approved ? 'Product approved' : 'Product rejected' });
});

// @desc  Super admin: Approve admin/rider
// @route PATCH /api/superadmin/users/:id/approve
export const approveUser = asyncHandler(async (req, res) => {
  const { approved } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { isApproved: approved }, { new: true });
  if (!user) { res.status(404); throw new Error('User not found'); }
  res.json({ success: true, user, message: approved ? 'User approved' : 'User rejected' });
});

// @desc  Super admin: Block/unblock user
// @route PATCH /api/superadmin/users/:id/block
export const blockUser = asyncHandler(async (req, res) => {
  const { blocked } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: blocked }, { new: true });
  if (!user) { res.status(404); throw new Error('User not found'); }
  res.json({ success: true, message: blocked ? 'User blocked' : 'User unblocked' });
});

// @desc  Super admin: Get all users
// @route GET /api/superadmin/users
export const getAllUsers = asyncHandler(async (req, res) => {
  const { role, page = 1, limit = 20 } = req.query;
  const query = role ? { role } : {};
  const skip = (Number(page) - 1) * Number(limit);
  const users = await User.find(query).skip(skip).limit(Number(limit)).sort({ createdAt: -1 });
  const total = await User.countDocuments(query);
  res.json({ success: true, users, total });
});

// @desc  Super admin: Get pending products
// @route GET /api/superadmin/products/pending
export const getPendingProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isApproved: false, isRejected: { $ne: true } }).populate('category', 'name').populate('createdBy', 'name email');
  res.json({ success: true, products });
});
