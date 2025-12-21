import { Router } from 'express';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config, googleClient, prisma } from '../config.js';
import { requireAuth } from '../middleware.js';

const router = Router();

/**
 * GET /auth/callback
 * Google OAuth callback - verifies Google token and creates/logs in user
 */
router.get('/callback', async (req: Request, res: Response) => {
  const token = req.query.token as string;
  if (!token) {
    return res.status(400).json({ error: 'Missing token' });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: config.googleClientId,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(400).json({ error: 'Invalid Google payload' });
    }

    // Fetch user from DB
    let dbUser = await prisma.user.findUnique({ where: { email: payload.email } });

    // If user does not exist, create it
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          name: payload.name || payload.email.split('@')[0] || '',
          email: payload.email,
          privileges: 'USER',
        },
      });
    }

    // Create JWT with user info and DB id
    const jwtPayload = {
      id: dbUser.id,
      email: payload.email,
      name: dbUser.name,
      picture: payload.picture,
      sub: payload.sub,
    };
    const jwtToken = jwt.sign(jwtPayload, config.jwtSecret, { expiresIn: '7d' });

    // Set JWT as HTTP-only cookie
    res.cookie('token', jwtToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      secure: true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ success: true, message: 'Login successful' });
  } catch (err) {
    res.status(401).json({
      error: 'Invalid Google token',
      details: err instanceof Error ? err.message : err
    });
  }
});

/**
 * GET /auth/check
 * Check if user is authenticated
 */
router.get('/check', requireAuth, (req: Request, res: Response) => {
  res.json({ authenticated: true, user: req.user });
});

/**
 * POST /auth/logout
 * Logout user by clearing auth cookie
 */
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: config.nodeEnv === 'production' ? 'none' : 'lax',
  });
  res.status(200).json({ message: 'Logged out' });
});

export default router;
