// Type definitions for match and league data

export interface PlayerInfo {
  id: number;
  name: string;
}

export interface Match {
  id: number;
  player1: PlayerInfo;
  player2: PlayerInfo;
  score1?: number | null;
  score2?: number | null;
  outcome: string;
  date?: string;
  round: number;
}

export interface Standing {
  id: number;
  name: string;
  gamesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  points: number;
  cardPoolUrl?: string | null;
}

export interface League {
  id: number;
  name: string;
  status?: string;
  createdAt?: string;
  startDate?: string | null;
  ownerId: number;
}

export interface LeagueData {
  league: League;
  matches: Match[];
  standings: Standing[];
}
