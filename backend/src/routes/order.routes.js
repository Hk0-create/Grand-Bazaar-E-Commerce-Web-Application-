import express from 'express';
import {
  createOrder, getMyOrders, getOrderById,
  getAllOrders, updateOrderStatus, assignRider, getRiderOrders
} from '../controllers/order.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);
router.post('/', authorize('user'), createOrder);
router.get('/my-orders', authorize('user'), getMyOrders);
router.get('/rider-orders', authorize('rider'), getRiderOrders);
router.get('/:id', getOrderById);
router.get('/', authorize('admin', 'superadmin'), getAllOrders);
router.patch('/:id/status', authorize('admin', 'superadmin', 'rider'), updateOrderStatus);
router.patch('/:id/assign-rider', authorize('admin', 'superadmin'), assignRider);

export default router;
