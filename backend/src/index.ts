import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import cors from 'cors';
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from './generated/prisma/client.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'MY_GOOGLE_CLIENT_ID';
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secret-key';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);
const DATABASE_URL = process.env.DATABASE_URL || '';
const adapter = new PrismaPg({connectionString: process.env.DATABASE_URL});
const prisma = new PrismaClient({adapter});

app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

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

app.get('/auth/check', (req, res) => {
  const token = req.cookies.token;
  console.log('Checking auth token:', token);
  if (!token) {
    return res.status(401).json({ authenticated: false, error: 'No token provided' });
  }
  try {
    const user = jwt.verify(token, JWT_SECRET);
    res.json({ authenticated: true, user });
    console.log('Response:', { authenticated: true, user });
  } catch (err) {
    return res.status(401).json({ authenticated: false, error: 'Invalid token' });
  }
});

app.get('/league/:id', async (req, res) => {
  const leagueId = parseInt(req.params.id, 10);
  if (isNaN(leagueId)) {
    return res.status(400).json({ error: 'Invalid league id' });
  }
  try {
    // Get league info and matches
    const league = await prisma.league.findUnique({
      where: { id: leagueId },
      include: {
        matches: {
          include: {
            player1: true,
            player2: true,
          },
        },
      },
    });
    if (!league) {
      return res.status(404).json({ error: 'League not found' });
    }
    // Build standings
    const standings: Record<string, any> = {};
    for (const match of league.matches) {
      // Only count matches with both players and a decided outcome
      if (match.outcome === 'TBD') continue;
      const players = [match.player1, match.player2];
      for (const player of players) {
        if (!player) continue;
        if (!standings[player.id]) {
          standings[player.id] = {
            name: player.name,
            gamesPlayed: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            points: 0,
          };
        }
        standings[player.id].gamesPlayed++;
      }
      // Outcome logic
      if (match.outcome === 'PLAYER1_WINS') {
        standings[match.player1Id].wins++;
        standings[match.player1Id].points += 3;
        standings[match.player2Id].losses++;
      } else if (match.outcome === 'PLAYER2_WINS') {
        standings[match.player2Id].wins++;
        standings[match.player2Id].points += 3;
        standings[match.player1Id].losses++;
      } else if (match.outcome === 'DRAW') {
        standings[match.player1Id].draws++;
        standings[match.player2Id].draws++;
        standings[match.player1Id].points++;
        standings[match.player2Id].points++;
      }
    }
    // Sort matches by round ascending
    const sortedMatches = [...league.matches].sort((a, b) => (a.round ?? 0) - (b.round ?? 0));
    // Convert standings to array and sort by points descending
    const standingsArr = Object.values(standings).sort((a, b) => b.points - a.points);
    res.json({
      league: {
        id: league.id,
        name: league.name,
        status: league.status,
        createdAt: league.createdAt,
        startDate: league.startDate,
        ownerId: league.ownerId,
      },
      matches: sortedMatches,
      standings: standingsArr,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch league', details: err instanceof Error ? err.message : err });
  }
});

app.get('/my-matches', async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }
  let user: any;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === 'string' || !('id' in decoded)) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token payload' });
    }
    user = decoded as { id: number };
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
  try {
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { player1Id: user.id },
          { player2Id: user.id },
        ],
      },
      include: {
        league: true,
        player1: true,
        player2: true,
      },
    });
    const sortedMatches = matches.sort((a, b) => (a.round ?? 0) - (b.round ?? 0));
    res.json({ matches: sortedMatches });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch matches', details: err instanceof Error ? err.message : err });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
