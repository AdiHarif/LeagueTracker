import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../config.js';
import logger from '../utils/logger.js';

const router = Router();

/**
 * GET /matches/my-matches
 * Get all matches for the authenticated user
 */
router.get('/my-matches', async (req: Request, res: Response) => {
  try {
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { player1Id: req.user!.id },
          { player2Id: req.user!.id },
        ],
      },
      include: {
        league: true,
        player1: true,
        player2: true,
      },
    });

    const sortedMatches = matches.sort((a, b) => (a.round) - (b.round));
    res.json({ matches: sortedMatches });
  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch matches',
      details: err instanceof Error ? err.message : err
    });
  }
});

/**
 * POST /matches/:id/score
 * Report score for a match (only if you're a player in that match)
 */
router.post('/:id/score', async (req: Request, res: Response) => {
  const matchId = parseInt(req.params.id!, 10);
  const { score1, score2 } = req.body;

  if (isNaN(matchId)) {
    return res.status(400).json({ error: 'Invalid match id' });
  }

  // Validate scores
  if (typeof score1 !== 'number' || typeof score2 !== 'number' || score1 < 0 || score2 < 0) {
    return res.status(400).json({ error: 'Invalid scores' });
  }
  if (score1 + score2 > 3) {
    return res.status(400).json({ error: 'Total games cannot exceed 3' });
  }

  const match = await prisma.match.findUnique({
    where: { id: matchId }
  });

  if (!match) {
    return res.status(404).json({ error: 'Match not found' });
  }

  // Check if user is one of the players
  if (match.player1Id !== req.user!.id && match.player2Id !== req.user!.id) {
    return res.status(403).json({ error: 'Forbidden: You are not a player in this match' });
  }

  // Check if match already has a score (critical section)
  if (match.score1 !== null || match.score2 !== null) {
    return res.status(409).json({ error: 'Match already has a score' });
  }

  // Determine outcome
  let outcome: 'PLAYER1_WINS' | 'PLAYER2_WINS' | 'DRAW';
  if (score1 > score2) {
    outcome = 'PLAYER1_WINS';
  } else if (score2 > score1) {
    outcome = 'PLAYER2_WINS';
  } else {
    outcome = 'DRAW';
  }

  // Update the match atomically
  let updatedMatch;
  try {
    updatedMatch = await prisma.match.update({
      where: { id: matchId, outcome: 'TBD' },
      data: {
        score1,
        score2,
        outcome,
        date: new Date(),
      },
      include: {
        player1: true,
        player2: true,
        league: true,
      },
    });
  } catch (err) {
    logger.error('Failed to update match %d: %s', matchId, err instanceof Error ? err.message : err);
    return res.status(500).json({ error: 'Failed to update match' });
  }

  logger.info('Match %d score updated by user %d: %d-%d (%s)', matchId, req.user!.id, score1, score2, updatedMatch.outcome);
  res.json({ success: true, match: updatedMatch });
});

export default router;
