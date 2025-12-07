import React from "react";
import playersData from "./league_players.json";
import matchesData from "./league_matches.json";

interface Player {
  uuid: string;
  name: string;
}

interface Match {
  match_id: string;
  player1: Player;
  player2: Player;
  played: boolean;
  score: { player1: number; player2: number } | null;
  date?: string;
}

const LeagueResultsMatrix: React.FC = () => {
  const players: Player[] = playersData as Player[];
  const matches: Match[] = matchesData as Match[];

  // Helper to find match result and color between two players
  const getMatchCell = (p1: Player, p2: Player) => {
    if (p1.uuid === p2.uuid) return { result: "-", color: "" };
    const match = matches.find(
      m =>
        (m.player1.uuid === p1.uuid && m.player2.uuid === p2.uuid) ||
        (m.player1.uuid === p2.uuid && m.player2.uuid === p1.uuid)
    );
    if (!match) return { result: "TBD", color: "preset-filled-surface-200-800" };
    if (!match.played || !match.score) return { result: "TBD", color: "preset-filled-surface-200-800" };
    let p1Score, p2Score;
    if (match.player1.uuid === p1.uuid) {
      p1Score = match.score.player1;
      p2Score = match.score.player2;
    } else {
      p1Score = match.score.player2;
      p2Score = match.score.player1;
    }
    const color = p1Score > p2Score ? "preset-filled-success-500" : p1Score < p2Score ? "preset-filled-error-500" : "preset-filled-surface-200-800";
    return { result: `${p1Score}-${p2Score}`, color };
  };

  return (
    <div className="overflow-auto">
      <table className="table-auto border-collapse w-full text-center">
        <thead>
          <tr>
            <th></th>
            {players.map(p => (
              <th key={p.uuid} className="preset-filled-primary-200-800">{p.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {players.map(rowPlayer => (
            <tr key={rowPlayer.uuid}>
              <th className="preset-filled-primary-200-800">{rowPlayer.name}</th>
              {players.map(colPlayer => {
                const { result, color } = getMatchCell(rowPlayer, colPlayer);
                return (
                  <td key={colPlayer.uuid} className={`${color}`}>
                    {result}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeagueResultsMatrix;
