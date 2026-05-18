import express from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User.model.js';
import Order from '../models/Order.model.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect, authorize('rider'));

// Rider: Get profile & orders via order routes
// Rider: Get their reviews
router.get('/my-reviews', asyncHandler(async (req, res) => {
  const Review = (await import('../models/Review.model.js')).default;
  const reviews = await Review.find({ rider: req.user._id, type: 'rider' }).populate('user', 'name avatar');
  res.json({ success: true, reviews });
}));

export default router;
