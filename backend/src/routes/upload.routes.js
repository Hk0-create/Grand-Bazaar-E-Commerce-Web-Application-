import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Cloudinary upload placeholder (integrate with multer-cloudinary in production)
router.post('/', protect, asyncHandler(async (req, res) => {
  // In production: use multer + cloudinary-storage
  // For now, return a placeholder response
  res.json({ success: true, url: req.body.url || '' });
}));

export default router;
