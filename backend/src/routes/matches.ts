import { Router } from 'express';
import type { Request, Response } from 'express';
import { prisma } from '../config.js';
import logger from '../utils/logger.js';
import { attachPrivileges } from '../middleware.js';
import { isAdminOrLeagueOwner } from '../utils/authorization.js';

const router = Router();

/**
 * Validate match scores
 * @returns Error message if invalid, null if valid
 */
function validateScores(score1: any, score2: any): string | null {
  if (typeof score1 !== 'number' || typeof score2 !== 'number' || score1 < 0 || score2 < 0) {
    return 'Invalid scores';
  }
  if (score1 + score2 > 3) {
    return 'Total games cannot exceed 3';
  }
  return null;
}

/**
 * Determine match outcome based on scores
 */
function determineOutcome(score1: number, score2: number): 'PLAYER1_WINS' | 'PLAYER2_WINS' | 'DRAW' {
  if (score1 > score2) {
    return 'PLAYER1_WINS';
  } else if (score2 > score1) {
    return 'PLAYER2_WINS';
  } else {
    return 'DRAW';
  }
}

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
 * Report score for a match (players in the match or admins/league owners)
 */
router.post('/:id/score', attachPrivileges, async (req: Request, res: Response) => {
  const matchId = parseInt(req.params.id!, 10);
  const { score1, score2 } = req.body;

  if (isNaN(matchId)) {
    return res.status(400).json({ error: 'Invalid match id' });
  }

  // Validate scores
  const scoreValidationError = validateScores(score1, score2);
  if (scoreValidationError) {
    return res.status(400).json({ error: scoreValidationError });
  }

  const match = await prisma.match.findUnique({
    where: { id: matchId }
  });

  if (!match) {
    return res.status(404).json({ error: 'Match not found' });
  }

  // Check if user is one of the players OR admin/league owner
  const isPlayerInMatch = match.player1Id === req.user!.id || match.player2Id === req.user!.id;
  const hasPermission = isPlayerInMatch || await isAdminOrLeagueOwner(
    req.user!.id,
    req.user!.privileges!,
    match.leagueId
  );

  if (!hasPermission) {
    return res.status(403).json({ error: 'Forbidden: You are not authorized to report this match score' });
  }

  // Check if match already has a score (critical section)
  if (match.score1 !== null || match.score2 !== null) {
    return res.status(409).json({ error: 'Match already has a score' });
  }

  // Determine outcome
  const outcome = determineOutcome(score1, score2);

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

/**
 * PUT /matches/:id/score
 * Edit score for a match (only for admins or league owners)
 */
router.put('/:id/score', attachPrivileges, async (req: Request, res: Response) => {
  const matchId = parseInt(req.params.id!, 10);
  const { score1, score2 } = req.body;

  if (isNaN(matchId)) {
    return res.status(400).json({ error: 'Invalid match id' });
  }

  // Validate scores
  const scoreValidationError = validateScores(score1, score2);
  if (scoreValidationError) {
    return res.status(400).json({ error: scoreValidationError });
  }

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      league: true,
    },
  });

  if (!match) {
    return res.status(404).json({ error: 'Match not found' });
  }

  // Check if user is admin or league owner
  const hasPermission = await isAdminOrLeagueOwner(
    req.user!.id,
    req.user!.privileges!,
    match.leagueId
  );

  if (!hasPermission) {
    return res.status(403).json({ error: 'Forbidden: Only admins or league owners can edit match scores' });
  }

  // Determine outcome
  const outcome = determineOutcome(score1, score2);

  // Update the match
  let updatedMatch;
  try {
    updatedMatch = await prisma.match.update({
      where: { id: matchId },
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
    logger.error('Failed to edit match %d: %s', matchId, err instanceof Error ? err.message : err);
    return res.status(500).json({ error: 'Failed to edit match score' });
  }

  logger.info('Match %d score edited by user %d (admin/owner): %d-%d (%s)', matchId, req.user!.id, score1, score2, updatedMatch.outcome);
  res.json({ success: true, match: updatedMatch });
});

/**
 * DELETE /matches/:id/score
 * Delete score for a match (only for admins or league owners)
 * Resets the match to TBD state
 */
router.delete('/:id/score', attachPrivileges, async (req: Request, res: Response) => {
  const matchId = parseInt(req.params.id!, 10);

  if (isNaN(matchId)) {
    return res.status(400).json({ error: 'Invalid match id' });
  }

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      league: true,
    },
  });

  if (!match) {
    return res.status(404).json({ error: 'Match not found' });
  }

  // Check if match has a score to delete
  if (match.score1 === null || match.score2 === null) {
    return res.status(400).json({ error: 'Match has no score to delete' });
  }

  // Check if user is admin or league owner
  const hasPermission = await isAdminOrLeagueOwner(
    req.user!.id,
    req.user!.privileges!,
    match.leagueId
  );

  if (!hasPermission) {
    return res.status(403).json({ error: 'Forbidden: Only admins or league owners can delete match scores' });
  }

  // Reset the match to TBD state
  let updatedMatch;
  try {
    updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        score1: null,
        score2: null,
        outcome: 'TBD',
        date: null,
      },
      include: {
        player1: true,
        player2: true,
        league: true,
      },
    });
  } catch (err) {
    logger.error('Failed to delete score for match %d: %s', matchId, err instanceof Error ? err.message : err);
    return res.status(500).json({ error: 'Failed to delete match score' });
  }

  logger.info('Match %d score deleted by user %d (admin/owner)', matchId, req.user!.id);
  res.json({ success: true, match: updatedMatch });
});

export default router;
