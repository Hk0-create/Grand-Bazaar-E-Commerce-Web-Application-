import asyncHandler from 'express-async-handler';
import passport from 'passport';
import crypto from 'crypto';
import User from '../models/User.model.js';
import { sendTokenResponse, generateToken } from '../utils/generateToken.js';

// @desc    Register user
// @route   POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }
  const user = await User.create({ name, email, password, role: 'user', isVerified: true });
  sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.password) {
    res.status(401);
    throw new Error('Invalid email or password');
  }
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }
  if (user.isBlocked) {
    res.status(403);
    throw new Error('Account blocked. Contact support.');
  }
  if (['admin', 'rider'].includes(user.role) && user.isApproved === false) {
    res.status(403);
    throw new Error('Account pending approval. Please wait for Super Admin review.');
  }
  sendTokenResponse(user, 200, res);
});

// @desc    Admin/Rider register (goes to super admin for approval)
// @route   POST /api/auth/register-admin
export const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!['admin', 'rider'].includes(role)) {
    res.status(400);
    throw new Error('Invalid role');
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const user = await User.create({ name, email, password, role, isApproved: false, isVerified: true });
  res.status(201).json({
    success: true,
    message: `${role === 'admin' ? 'Admin' : 'Rider'} registration request sent. Please wait for approval.`,
  });
});

// @desc    Logout
// @route   POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.json({ success: true, message: 'Logged out successfully' });
});

// @desc    Google OAuth callback
// @route   GET /api/auth/google/callback
export const googleCallback = asyncHandler(async (req, res) => {
  const token = generateToken(req.user._id);
  res.redirect(`${process.env.CLIENT_URL}/auth/google/success?token=${token}&role=${req.user.role}`);
});

// @desc    Get current user
// @route   GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'name images finalPrice');
  res.json({ success: true, user });
});
