import asyncHandler from 'express-async-handler';
import Review from '../models/Review.model.js';
import Order from '../models/Order.model.js';
import Product from '../models/Product.model.js';
import User from '../models/User.model.js';

// @desc  Submit review (product + rider) - required after delivery
// @route POST /api/reviews
export const submitReview = asyncHandler(async (req, res) => {
  const { orderId, productReviews, riderReview } = req.body;
  const order = await Order.findById(orderId).populate('items.product');
  if (!order) { res.status(404); throw new Error('Order not found'); }
  if (order.user.toString() !== req.user._id.toString()) { res.status(403); throw new Error('Not authorized'); }
  if (order.isReviewedByUser) { res.status(400); throw new Error('Already reviewed'); }

  // Save product reviews
  const reviewDocs = [];
  for (const pr of productReviews) {
    reviewDocs.push(await Review.create({
      user: req.user._id, product: pr.productId, order: orderId,
      type: 'product', rating: pr.rating, comment: pr.comment,
    }));
    // Update product rating
    const reviews = await Review.find({ product: pr.productId, type: 'product' });
    const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(pr.productId, { rating: avg, numReviews: reviews.length });
  }

  // Save rider review
  if (riderReview && order.rider) {
    await Review.create({
      user: req.user._id, rider: order.rider, order: orderId,
      type: 'rider', rating: riderReview.rating, comment: riderReview.comment,
    });
    // Update rider rating
    const riderReviews = await Review.find({ rider: order.rider, type: 'rider' });
    const riderAvg = riderReviews.reduce((a, r) => a + r.rating, 0) / riderReviews.length;
    await User.findByIdAndUpdate(order.rider, { 'riderStats.avgRating': riderAvg });
  }

  order.isReviewedByUser = true;
  await order.save();
  res.json({ success: true, message: 'Review submitted successfully' });
});

// @desc  Get product reviews
// @route GET /api/reviews/product/:productId
export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId, type: 'product' })
    .populate('user', 'name avatar').sort({ createdAt: -1 });
  res.json({ success: true, reviews });
});

// @desc  Get rider reviews
// @route GET /api/reviews/rider/:riderId
export const getRiderReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ rider: req.params.riderId, type: 'rider' })
    .populate('user', 'name avatar').sort({ createdAt: -1 });
  res.json({ success: true, reviews });
});
