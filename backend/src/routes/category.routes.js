import express from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getCategories);
router.post('/', protect, authorize('admin', 'superadmin'), createCategory);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateCategory);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteCategory);

export default router;
