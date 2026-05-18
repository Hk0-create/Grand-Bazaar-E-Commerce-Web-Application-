import express from 'express';
import { submitReview, getProductReviews, getRiderReviews } from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, submitReview);
router.get('/product/:productId', getProductReviews);
router.get('/rider/:riderId', protect, getRiderReviews);

export default router;
