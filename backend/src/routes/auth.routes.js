import express from 'express';
import passport from 'passport';
import { register, login, logout, getMe, registerAdmin, googleCallback } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/register-admin', registerAdmin);
router.get('/me', protect, getMe);

// Google OAuth — only register routes if Google strategy is configured
const googleConfigured =
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_ID !== 'your_google_client_id';

if (googleConfigured) {
  router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
  router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), googleCallback);
} else {
  // Placeholder routes that return a clear message if Google OAuth is not configured
  router.get('/google', (req, res) => {
    res.status(503).json({ success: false, message: 'Google OAuth not configured. Add GOOGLE_CLIENT_ID to .env' });
  });
  router.get('/google/callback', (req, res) => {
    res.status(503).json({ success: false, message: 'Google OAuth not configured.' });
  });
}

export default router;
