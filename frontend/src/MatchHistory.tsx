import React from "react";
import matchesData from "./league_matches.json";
import MatchResult from "./MatchResult";

interface PlayerInfo {
  uuid: string;
  name: string;
}

interface Match {
  match_id: string;
  player1: PlayerInfo;
  player2: PlayerInfo;
  played: boolean;
  score: { player1: number; player2: number } | null;
  date?: string;
}

const MatchHistory: React.FC = () => {
  const matches: Match[] = matchesData as Match[];

  // Sort: played matches by date descending, then unplayed at the end
  const sortedMatches = [
    ...matches.filter(m => m.played).sort((a, b) => (b.date! > a.date! ? 1 : -1)),
    ...matches.filter(m => !m.played)
  ];

  return (
    <div className="w-full max-w-xl">
      <h2 style={{ textAlign: "center" }}>Match History</h2>
      {sortedMatches.map(match => (
        <div className="m-4">
          <MatchResult key={match.match_id} {...match} />
        </div>
      ))}
    </div>
  );
};

export default MatchHistory;
