import React, { useEffect, useState } from "react";
import { Tabs } from "@skeletonlabs/skeleton-react";

const LeagueResultsTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("standings");
  const [leagueData, setLeagueData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/league/1`, { credentials: "include" })
      .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch league");
      return res.json();
      })
      .then((data) => {
      setLeagueData(data);
      setLoading(false);
      })
      .catch((err) => {
      setError(err.message);
      setLoading(false);
      });
  }, []);

  if (loading) return <div className="preset-filled-primary-200-800 p-8 rounded-xl text-center">Loading...</div>;
  if (error) return <div className="preset-filled-error-200-800 p-8 rounded-xl text-center">Error: {error}</div>;
  if (!leagueData) return <div className="preset-filled-surface-200-800 p-8 rounded-xl text-center">No league data found.</div>;

  const { league, matches, standings } = leagueData;

  return (
    <div className="max-w-4xl mx-auto mt-8 preset-filled-surface-200-800 rounded-xl shadow-lg p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">{league.name}</h1>
      <Tabs value={activeTab} onValueChange={(details) => setActiveTab(details.value)}>
        <div className="flex w-full mb-4">
          <Tabs.List className="flex w-full gap-2">
            <Tabs.Trigger className="flex-1 preset-filled-primary-200-800" value="standings">
              Standings
            </Tabs.Trigger>
            <Tabs.Trigger className="flex-1 preset-filled-primary-200-800" value="matches">
              Matches
            </Tabs.Trigger>
          </Tabs.List>
        </div>
        <Tabs.Content value="standings">
          <div className="overflow-x-auto">
            <h2 className="text-lg font-semibold mb-4 text-center preset-filled-primary-400">League Standings</h2>
            <table className="min-w-full border rounded-lg overflow-hidden preset-filled-surface-200-800">
              <thead className="preset-filled-primary-100-800">
                <tr>
                  <th className="p-2">Name</th>
                  <th className="p-2">Games Played</th>
                  <th className="p-2">Wins</th>
                  <th className="p-2">Draws</th>
                  <th className="p-2">Losses</th>
                  <th className="p-2">Points</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((player: any, idx: number) => (
                  <tr key={player.name} className={idx === 0 ? "preset-filled-success-100-800 font-bold" : ""}>
                    <td className="p-2">{player.name}</td>
                    <td className="p-2">{player.gamesPlayed}</td>
                    <td className="p-2">{player.wins}</td>
                    <td className="p-2">{player.draws}</td>
                    <td className="p-2">{player.losses}</td>
                    <td className="p-2">{player.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tabs.Content>
        <Tabs.Content value="matches">
          <div className="overflow-x-auto">
            <h2 className="text-lg font-semibold mb-4 text-center preset-filled-primary-400">League Matches</h2>
            <table className="min-w-full border rounded-lg overflow-hidden preset-filled-surface-200-800">
              <thead className="preset-filled-primary-100-800">
                <tr>
                  <th className="p-2">Round</th>
                  <th className="p-2">Player 1</th>
                  <th className="p-2">Player 2</th>
                  <th className="p-2">Score</th>
                  <th className="p-2">Outcome</th>
                  <th className="p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((match: any) => (
                  <tr key={match.id}>
                    <td className="p-2">{match.round}</td>
                    <td className="p-2">{match.player1?.name || '-'}</td>
                    <td className="p-2">{match.player2?.name || '-'}</td>
                    <td className="p-2">
                      {match.score1 !== undefined && match.score2 !== undefined
                        ? `${match.score1} - ${match.score2}`
                        : "TBD"}
                    </td>
                    <td className="p-2">{match.outcome}</td>
                    <td className="p-2">{match.date ? new Date(match.date).toLocaleDateString() : "TBD"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Tabs.Content>
      </Tabs>
    </div>
  );
};

export default LeagueResultsTabs;
