import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/profile', asyncHandler(async (req, res) => {
  const User = (await import('../models/User.model.js')).default;
  const user = await User.findById(req.user._id).populate('wishlist', 'name images finalPrice');
  res.json({ success: true, user });
}));

router.put('/profile', asyncHandler(async (req, res) => {
  const User = (await import('../models/User.model.js')).default;
  const { name, phone, avatar } = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, { name, phone, avatar }, { new: true });
  res.json({ success: true, user });
}));

router.post('/wishlist/:productId', asyncHandler(async (req, res) => {
  const User = (await import('../models/User.model.js')).default;
  const user = await User.findById(req.user._id);
  const idx = user.wishlist.indexOf(req.params.productId);
  if (idx > -1) user.wishlist.splice(idx, 1);
  else user.wishlist.push(req.params.productId);
  await user.save();
  res.json({ success: true, wishlist: user.wishlist });
}));

export default router;
