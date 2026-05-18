import express from 'express';
import { getProducts, getProductById, getFeaturedProducts, createProduct, updateProduct, deleteProduct, addDiscount } from '../controllers/product.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);
router.post('/', protect, authorize('admin', 'superadmin'), createProduct);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateProduct);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteProduct);
router.patch('/:id/discount', protect, authorize('admin', 'superadmin'), addDiscount);

export default router;
