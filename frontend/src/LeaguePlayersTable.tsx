import React from "react";
import playersData from "./league_players.json";

interface Player {
  uuid: string;
  name: string;
  wins: number;
  losses: number;
}

const LeaguePlayersTable: React.FC = () => {
  // Sort players by wins descending
  const sortedPlayers = [...(playersData as Player[])].sort((a, b) => b.wins - a.wins);

  return (
    <div className="table-wrap" style={{ overflowX: "auto" }}>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Wins</th>
            <th>Losses</th>
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map((player) => (
            <tr key={player.uuid}>
              <td>{player.name}</td>
              <td>{player.wins}</td>
              <td>{player.losses}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaguePlayersTable;
