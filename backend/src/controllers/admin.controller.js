import asyncHandler from 'express-async-handler';
import User from '../models/User.model.js';
import Order from '../models/Order.model.js';
import Product from '../models/Product.model.js';

// @desc    Admin: Get all riders
// @route   GET /api/admin/riders
export const getRiders = asyncHandler(async (req, res) => {
  const riders = await User.find({ role: 'rider' }).sort({ createdAt: -1 });
  res.json({ success: true, riders });
});

// @desc    Admin: Approve/reject rider
// @route   PATCH /api/admin/riders/:id/approve
export const approveRider = asyncHandler(async (req, res) => {
  const { approved } = req.body;
  const rider = await User.findOneAndUpdate(
    { _id: req.params.id, role: 'rider' },
    { isApproved: approved },
    { new: true }
  );

  if (!rider) {
    res.status(404);
    throw new Error('Rider not found');
  }

  res.json({
    success: true,
    rider,
    message: approved ? 'Rider approved successfully' : 'Rider rejected'
  });
});

// @desc    Admin: Get available (approved & unblocked) riders
// @route   GET /api/admin/riders/available
export const getAvailableRiders = asyncHandler(async (req, res) => {
  const riders = await User.find({
    role: 'rider',
    isApproved: true,
    isBlocked: false
  }).select('name email avatar phone');
  res.json({ success: true, riders });
});

// @desc    Admin: Get dashboard stats
// @route   GET /api/admin/stats
export const getAdminDashboardStats = asyncHandler(async (req, res) => {
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();
  const pendingProducts = await Product.countDocuments({ isApproved: false });
  const totalCustomers = await User.countDocuments({ role: 'user' });

  // Sum revenue from paid orders
  const revenueResult = await Order.aggregate([
    { $match: { paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$totalPrice' } } }
  ]);
  const totalRevenue = revenueResult[0]?.total || 0;

  // Monthly revenue for the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const monthlySalesRaw = await Order.aggregate([
    { $match: { createdAt: { $gte: sixMonthsAgo }, paymentStatus: 'paid' } },
    { $group: { 
        _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } }, 
        revenue: { $sum: '$totalPrice' } 
    } },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  // Format monthlySales helper
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlySales = monthlySalesRaw.map((s) => ({
    month: monthNames[s._id.month - 1],
    revenue: s.revenue
  }));

  // If monthlySales is empty, generate clean empty months so chart displays nicely
  if (monthlySales.length === 0) {
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      monthlySales.push({
        month: monthNames[d.getMonth()],
        revenue: 0
      });
    }
  }

  // Count orders by status
  const statuses = ['pending', 'confirmed', 'processing', 'assigned', 'out_for_delivery', 'delivered', 'cancelled'];
  const statusCounts = {};
  for (const s of statuses) {
    statusCounts[s] = await Order.countDocuments({ status: s });
  }

  res.json({
    success: true,
    stats: {
      totalOrders,
      totalProducts,
      pendingProducts,
      totalCustomers,
      totalRevenue
    },
    monthlySales,
    statusCounts
  });
});
