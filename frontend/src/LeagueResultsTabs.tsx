import React, { useEffect, useState } from "react";
import { Tabs } from "@skeletonlabs/skeleton-react";
import MatchResult from "./MatchResult";

const LeagueResultsTabs: React.FC = () => {
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
    <div className="w-full preset-glass-neutral rounded-2xl p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">{league.name}</h1>
      <Tabs defaultValue={"standings"}>
        <div className="flex w-full mb-4">
          <Tabs.List className="flex w-full gap-2">
            <Tabs.Trigger className="flex-1 btn-lg" value="standings">
              Standings
            </Tabs.Trigger>
            <Tabs.Trigger className="flex-1 btn-lg" value="matches">
              Matches
            </Tabs.Trigger>
            <Tabs.Indicator className="preset-filled-primary-200-800" />
          </Tabs.List>
        </div>
        <Tabs.Content value="standings">
          <div className="overflow-x-auto">
            <table className="min-w-full rounded-lg overflow-hidden preset-filled-surface-200-800">
              <thead className="preset-filled-primary-200-800">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Games Played</th>
                  <th className="p-4">Wins</th>
                  <th className="p-4">Draws</th>
                  <th className="p-4">Losses</th>
                  <th className="p-4">Points</th>
                </tr>
              </thead>
                <tbody>
                {standings.map((player: any, idx: number) => (
                  <tr
                  key={player.name}
                  className={`${idx === 0 ? "preset-filled-success-100-900 font-bold" : ""} border-b border-surface-50-950 last:border-b-0`}
                  >
                  <td className="p-4 font-semibold text-lg">{player.name}</td>
                  <td className="p-4 text-lg">{player.gamesPlayed}</td>
                  <td className="p-4 text-lg">{player.wins}</td>
                  <td className="p-4 text-lg">{player.draws}</td>
                  <td className="p-4 text-lg">{player.losses}</td>
                  <td className="p-4 text-lg">{player.points}</td>
                  </tr>
                ))}
                </tbody>
            </table>
          </div>
        </Tabs.Content>
        <Tabs.Content value="matches">
            <div className="flex flex-col gap-4 items-center snap-x scroll-px-4 snap-mandatory scroll-smooth overflow-y-auto h-full">
            {matches.map((match: any) => (
              <MatchResult
              key={match.id}
              id={match.id}
              player1={match.player1}
              player2={match.player2}
              score1={match.score1}
              score2={match.score2}
              outcome={match.outcome}
              date={match.date}
              />
            ))}
            </div>
        </Tabs.Content>
      </Tabs>
    </div>
  );
};

export default LeagueResultsTabs;
