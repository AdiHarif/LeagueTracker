import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/prisma/client.js';

// Load environment variables
dotenv.config();

// Configuration object
export const config = {
  port: process.env.PORT || 3001,
  jwtSecret: process.env.JWT_SECRET || 'your-very-secret-key',
  googleClientId: process.env.GOOGLE_CLIENT_ID || 'MY_GOOGLE_CLIENT_ID',
  databaseUrl: process.env.DATABASE_URL || '',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development',
};

// Google OAuth2 client
export const googleClient = new OAuth2Client(config.googleClientId);

// Prisma client with PostgreSQL adapter
const adapter = new PrismaPg({ connectionString: config.databaseUrl });
export const prisma = new PrismaClient({ adapter });
