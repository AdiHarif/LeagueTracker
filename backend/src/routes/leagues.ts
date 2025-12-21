import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../config.js';
import { calculateStandings } from '../utils/standings.js';

const router = Router();

/**
 * GET /leagues/:id
 * Get league details including matches and standings
 */
router.get('/:id', async (req: Request, res: Response) => {
  const leagueId = parseInt(req.params.id!, 10);

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

    // Check if user is part of the league (owner or player in any match)
    const userId = req.user!.id;
    const isOwner = league.ownerId === userId;
    const isPlayer = league.matches.some(
      match => match.player1Id === userId || match.player2Id === userId
    );

    if (!isOwner && !isPlayer) {
      return res.status(403).json({ error: 'Forbidden: You are not part of this league' });
    }

    // Calculate standings
    const standingsArr = calculateStandings(league.matches);

    // Sort matches by round ascending
    const sortedMatches = [...league.matches].sort((a, b) => (a.round ?? 0) - (b.round ?? 0));

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
    res.status(500).json({
      error: 'Failed to fetch league',
      details: err instanceof Error ? err.message : err
    });
  }
});

export default router;
