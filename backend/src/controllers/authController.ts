import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Extend the Express Request interface to include the user property
interface AuthRequest extends Request {
  user?: User;
}

// Initialize the Google Auth client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * @desc    Handles the Google OAuth callback
 * @route   POST /api/auth/google/callback
 * @access  Public
 */
export const googleOAuthHandler = async (req: Request, res: Response) => {
  const { token } = req.body;

  try {
    // Verify the ID token from Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(400).json({ message: 'Invalid Google token' });
    }

    const { sub: providerId, email, name } = payload;

    if (!email || !name) {
      return res.status(400).json({ message: 'Email or name not available from Google' });
    }

    // Check if the user already exists in the database
    let user = await User.findOne({ where: { email } });

    if (!user) {
      // If the user doesn't exist, create a new one
      user = await User.create({
        email,
        name,
        provider: 'google',
        providerId,
      });
    }

    // Create a JWT for the user
    const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '1d',
    });

    // Send the JWT to the client
    res.status(200).json({
      token: jwtToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Google OAuth Error:', error);
    res.status(500).json({ message: 'Server error during Google authentication' });
  }
};

/**
 * @desc    Get the current authenticated user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req: AuthRequest, res: Response) => {
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json({ message: 'Not authorized' });
  }
};