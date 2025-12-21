import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from './config.js';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        name: string;
        picture?: string;
        sub?: string;
      };
    }
  }
}

/**
 * Middleware to verify JWT token and attach user to request
 * Returns 401 if token is missing or invalid
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    if (typeof decoded === 'string' || !('id' in decoded)) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token payload' });
    }

    // Attach user to request object
    req.user = decoded as {
      id: number;
      email: string;
      name: string;
      picture?: string;
      sub?: string;
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

/**
 * Optional auth middleware - doesn't fail if no token, just doesn't set req.user
 * Useful for endpoints that work with or without authentication
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);

    if (typeof decoded !== 'string' && 'id' in decoded) {
      req.user = decoded as {
        id: number;
        email: string;
        name: string;
        picture?: string;
        sub?: string;
      };
    }
  } catch (err) {
    // Invalid token, but we continue anyway
  }

  next();
};
