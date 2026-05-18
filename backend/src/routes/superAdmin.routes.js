import express from 'express';
import { getDashboardStats, approveProduct, approveUser, blockUser, getAllUsers, getPendingProducts } from '../controllers/superAdmin.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect, authorize('superadmin'));
router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.get('/products/pending', getPendingProducts);
router.patch('/products/:id/approve', approveProduct);
router.patch('/users/:id/approve', approveUser);
router.patch('/users/:id/block', blockUser);

export default router;
