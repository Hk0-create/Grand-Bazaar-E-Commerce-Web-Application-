import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart.model.js';
import Product from '../models/Product.model.js';

// @desc  Get user cart
// @route GET /api/cart
export const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name images finalPrice sellingPrice discount stock');
  if (!cart) return res.json({ success: true, cart: { items: [], totalAmount: 0 } });
  res.json({ success: true, cart });
});

// @desc  Add to cart
// @route POST /api/cart
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, color = '', size = '' } = req.body;
  const product = await Product.findById(productId);
  if (!product) { res.status(404); throw new Error('Product not found'); }
  if (product.stock < quantity) { res.status(400); throw new Error('Insufficient stock'); }

  const price = product.finalPrice || product.sellingPrice;
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [{ product: productId, quantity, color, size, price }] });
  } else {
    const existingIdx = cart.items.findIndex(
      (i) => i.product.toString() === productId && i.color === color && i.size === size
    );
    if (existingIdx >= 0) {
      cart.items[existingIdx].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, color, size, price });
    }
    await cart.save();
  }

  await cart.populate('items.product', 'name images finalPrice sellingPrice discount stock');
  res.json({ success: true, cart });
});

// @desc  Update cart item
// @route PUT /api/cart/:itemId
export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) { res.status(404); throw new Error('Cart not found'); }
  const item = cart.items.id(req.params.itemId);
  if (!item) { res.status(404); throw new Error('Cart item not found'); }
  item.quantity = quantity;
  await cart.save();
  await cart.populate('items.product', 'name images finalPrice sellingPrice discount stock');
  res.json({ success: true, cart });
});

// @desc  Remove cart item
// @route DELETE /api/cart/:itemId
export const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) { res.status(404); throw new Error('Cart not found'); }
  cart.items = cart.items.filter((i) => i._id.toString() !== req.params.itemId);
  await cart.save();
  res.json({ success: true, message: 'Item removed', cart });
});

// @desc  Clear cart
// @route DELETE /api/cart
export const clearCart = asyncHandler(async (req, res) => {
  await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });
  res.json({ success: true, message: 'Cart cleared' });
});
