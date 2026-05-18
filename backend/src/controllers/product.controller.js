import asyncHandler from 'express-async-handler';
import Product from '../models/Product.model.js';
import Category from '../models/Category.model.js';
import slugify from 'slugify';

// @desc  Get all approved products (public)
// @route GET /api/products
export const getProducts = asyncHandler(async (req, res) => {
  const { keyword, category, minPrice, maxPrice, sort, page = 1, limit = 12, color, size } = req.query;
  const query = { isApproved: true, isActive: true };

  if (keyword) {
    query.$or = [
      { name: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
      { tags: { $in: [new RegExp(keyword, 'i')] } }
    ];
  }
  if (category) query.category = category;
  if (color) query.colors = { $in: [color] };
  if (size) query.sizes = { $in: [size] };
  if (minPrice || maxPrice) {
    query.sellingPrice = {};
    if (minPrice) query.sellingPrice.$gte = Number(minPrice);
    if (maxPrice) query.sellingPrice.$lte = Number(maxPrice);
  }

  let sortOption = {};
  if (sort === 'price_asc') sortOption = { sellingPrice: 1 };
  else if (sort === 'price_desc') sortOption = { sellingPrice: -1 };
  else if (sort === 'rating') sortOption = { rating: -1 };
  else if (sort === 'newest') sortOption = { createdAt: -1 };
  else sortOption = { createdAt: -1 };

  const skip = (Number(page) - 1) * Number(limit);
  const total = await Product.countDocuments(query);
  const products = await Product.find(query)
    .populate('category', 'name slug')
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit));

  res.json({ success: true, products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

// @desc  Get single product
// @route GET /api/products/:id
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name slug').populate('createdBy', 'name');
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ success: true, product });
});

// @desc  Get featured products
// @route GET /api/products/featured
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true, isApproved: true, isActive: true })
    .populate('category', 'name slug')
    .limit(8);
  res.json({ success: true, products });
});

// @desc  Admin: Create product (pending approval)
// @route POST /api/products
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, category, costPrice, sellingPrice, deliveryCharges, stock, colors, sizes, tags, images } = req.body;
  const slug = slugify(name, { lower: true, strict: true }) + '-' + Date.now();
  const product = await Product.create({
    name, slug, description, category, costPrice, sellingPrice,
    deliveryCharges, stock, colors, sizes, tags, images,
    createdBy: req.user._id,
    isApproved: false,
    isActive: false,
  });
  res.status(201).json({ success: true, message: 'Product submitted for approval', product });
});

// @desc  Admin: Update product
// @route PUT /api/products/:id
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  Object.assign(product, req.body);
  if (req.body.name) product.slug = slugify(req.body.name, { lower: true, strict: true }) + '-' + Date.now();
  await product.save();
  res.json({ success: true, product });
});

// @desc  Admin: Delete product
// @route DELETE /api/products/:id
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ success: true, message: 'Product deleted' });
});

// @desc  Admin: Add discount
// @route PATCH /api/products/:id/discount
export const addDiscount = asyncHandler(async (req, res) => {
  const { discount } = req.body;
  const product = await Product.findByIdAndUpdate(req.params.id, { discount }, { new: true });
  if (!product) { res.status(404); throw new Error('Product not found'); }
  res.json({ success: true, product });
});
