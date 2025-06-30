import express, { Router } from 'express';
import { googleOAuthHandler, getMe } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router: Router = express.Router();

/**
 * @route   POST /api/auth/google/callback
 * @desc    Google OAuth callback
 * @access  Public
 */
router.post('/google/callback', googleOAuthHandler);

/**
 * @route   POST /api/auth/apple/callback
 * @desc    Apple OAuth callback (placeholder)
 * @access  Public
 */
router.post('/apple/callback', (req, res) => {
  res.status(501).json({ message: 'Apple OAuth not yet implemented' });
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
router.get('/me', protect, getMe);

export default router;