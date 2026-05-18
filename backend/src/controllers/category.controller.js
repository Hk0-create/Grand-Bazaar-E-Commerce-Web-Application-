import asyncHandler from 'express-async-handler';
import Category from '../models/Category.model.js';
import slugify from 'slugify';

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true });
  res.json({ success: true, categories });
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, description, image } = req.body;
  const slug = slugify(name, { lower: true, strict: true });
  const category = await Category.create({ name, slug, description, image, createdBy: req.user._id });
  res.status(201).json({ success: true, category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) { res.status(404); throw new Error('Category not found'); }
  res.json({ success: true, category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Category deleted' });
});
