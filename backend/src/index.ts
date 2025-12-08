import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'MY_GOOGLE_CLIENT_ID';
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secret-key';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

app.use(cookieParser());

app.get('/', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  try {
    const user = jwt.verify(token, JWT_SECRET);
    res.json({
      message: 'Welcome to the Sealed League Tracker backend API!',
      user,
    });
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
});

app.get('/auth/callback', async (req, res) => {
  const token = req.query.token as string;
  if (!token) {
    return res.status(400).json({ error: 'Missing token' });
  }
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ error: 'Invalid Google payload' });
    }
    // Create JWT with user info (customize claims as needed)
    const jwtPayload = {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      sub: payload.sub,
    };
    const jwtToken = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: '7d' });
    // Set JWT as HTTP-only cookie
    res.cookie('token', jwtToken, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.json({ message: 'Google token verified, JWT issued', user: jwtPayload });
  } catch (err) {
    res.status(401).json({ error: 'Invalid Google token', details: err instanceof Error ? err.message : err });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
