import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config, prisma } from './config.js';
import type { UserPrivileges } from './generated/prisma/enums.js';

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
        privileges?: UserPrivileges;
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

/**
 * Middleware to fetch user privileges from database and attach to req.user
 * Must be used after requireAuth
 */
export const attachPrivileges = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized: No user found' });
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { privileges: true },
    });

    if (!dbUser) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    // Attach privileges to existing user object
    req.user.privileges = dbUser.privileges;

    next();
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Middleware to require admin privileges
 * Must be used after requireAuth and attachPrivileges
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized: No user found' });
  }

  if (!req.user.privileges) {
    return res.status(500).json({ error: 'Internal error: Privileges not loaded. Use attachPrivileges middleware first.' });
  }

  if (req.user.privileges !== 'ADMIN') {
    return res.status(403).json({ error: 'Forbidden: Admin privileges required' });
  }

  next();
};
