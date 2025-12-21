import type { Match, User } from '../generated/prisma/client.js';

export interface PlayerStanding {
  id: number;
  name: string;
  gamesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
}

type MatchWithPlayers = Match & {
  player1: User;
  player2: User;
};

/**
 * Calculate standings from a list of matches
 * Points system: Win = 3 points, Draw = 1 point, Loss = 0 points
 *
 * @param matches - Array of matches with player information
 * @returns Array of player standings sorted by points (descending)
 */
export function calculateStandings(matches: MatchWithPlayers[]): PlayerStanding[] {
  const standings: Record<number, PlayerStanding> = {};

  for (const match of matches) {
    // Only count matches with both players and a decided outcome
    if (match.outcome === 'TBD') continue;

    const players = [match.player1, match.player2];

    // Initialize player standings if they don't exist
    for (const player of players) {
      if (!player) continue;

      if (!standings[player.id]) {
        standings[player.id] = {
          id: player.id,
          name: player.name,
          gamesPlayed: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          points: 0,
        };
      }
      standings[player.id]!.gamesPlayed++;
    }

    // Update standings based on match outcome
    if (match.outcome === 'PLAYER1_WINS') {
      standings[match.player1Id]!.wins++;
      standings[match.player1Id]!.points += 3;
      standings[match.player2Id]!.losses++;
    } else if (match.outcome === 'PLAYER2_WINS') {
      standings[match.player2Id]!.wins++;
      standings[match.player2Id]!.points += 3;
      standings[match.player1Id]!.losses++;
    } else if (match.outcome === 'DRAW') {
      standings[match.player1Id]!.draws++;
      standings[match.player2Id]!.draws++;
      standings[match.player1Id]!.points++;
      standings[match.player2Id]!.points++;
    }
  }

  // Convert to array and sort by points (descending)
  return Object.values(standings).sort((a, b) => b.points - a.points);
}
