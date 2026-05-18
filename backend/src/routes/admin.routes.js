import express from 'express';
import { getRiders, approveRider, getAvailableRiders, getAdminDashboardStats } from '../controllers/admin.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect, authorize('admin', 'superadmin'));

// Admin Rider management and Dashboard stats routes
router.get('/riders', getRiders);
router.patch('/riders/:id/approve', approveRider);
router.get('/riders/available', getAvailableRiders);
router.get('/stats', getAdminDashboardStats);

export default router;
