import React, { useEffect, useState } from "react";
import { Tabs } from "@skeletonlabs/skeleton-react";
import MatchResult from "../match/MatchResult";
import { useUser } from "../../hooks/useUser";
import type { LeagueData, Standing, Match } from "../../types";

const LeagueResultsTabs: React.FC = () => {
  const [leagueData, setLeagueData] = useState<LeagueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  const fetchLeague = () => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/leagues/1`, { credentials: "include" })
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
  };

  useEffect(() => {
    fetchLeague();
  }, []);

  if (loading) return <div className="preset-filled-primary-200-800 p-8 rounded-xl text-center">Loading...</div>;
  if (error) return <div className="preset-filled-error-200-800 p-8 rounded-xl text-center">Error: {error}</div>;
  if (!leagueData) return <div className="preset-filled-surface-200-800 p-8 rounded-xl text-center">No league data found.</div>;

  const { league, matches, standings } = leagueData;

  return (
    <div className="w-full preset-glass-neutral rounded-xl md:rounded-2xl p-3 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">{league.name}</h1>
      <Tabs defaultValue={"standings"}>
        <div className="flex w-full mb-4">
          <Tabs.List className="flex w-full gap-1 md:gap-2">
            <Tabs.Trigger className="flex-1 btn-md md:btn-lg text-sm md:text-base" value="standings">
              Standings
            </Tabs.Trigger>
            <Tabs.Trigger className="flex-1 btn-md md:btn-lg text-sm md:text-base" value="matches">
              Matches
            </Tabs.Trigger>
            <Tabs.Indicator className="preset-filled-primary-200-800" />
          </Tabs.List>
        </div>
        <Tabs.Content value="standings">
          <div className="overflow-x-auto -mx-3 px-3 md:mx-0 md:px-0">
            <table className="min-w-full rounded-lg overflow-hidden preset-filled-surface-200-800">
              <thead className="preset-filled-primary-200-800">
                <tr>
                  <th className="p-3 md:p-5 text-xs md:text-base sticky left-0 preset-filled-primary-200-800 z-10">Name</th>
                  <th className="p-3 md:p-5 text-xs md:text-base whitespace-nowrap">GP</th>
                  <th className="p-3 md:p-5 text-xs md:text-base">W</th>
                  <th className="p-3 md:p-5 text-xs md:text-base">D</th>
                  <th className="p-3 md:p-5 text-xs md:text-base">L</th>
                  <th className="p-3 md:p-5 text-xs md:text-base">Pts</th>
                </tr>
              </thead>
                <tbody>
                {standings.map((player: Standing, idx: number) => (
                  <tr
                  key={player.name}
                  className={`${idx === 0 ? "preset-filled-success-100-900 font-bold" : ""} border-b border-surface-50-950 last:border-b-0`}
                  >
                  <td className="p-3 md:p-5 font-semibold text-sm md:text-lg sticky left-0 z-10 whitespace-nowrap">{player.name}</td>
                  <td className="p-3 md:p-5 text-sm md:text-lg">{player.gamesPlayed}</td>
                  <td className="p-3 md:p-5 text-sm md:text-lg">{player.wins}</td>
                  <td className="p-3 md:p-5 text-sm md:text-lg">{player.draws}</td>
                  <td className="p-3 md:p-5 text-sm md:text-lg">{player.losses}</td>
                  <td className="p-3 md:p-5 text-sm md:text-lg">{player.points}</td>
                  </tr>
                ))}
                </tbody>
            </table>
          </div>
        </Tabs.Content>
        <Tabs.Content value="matches">
            <div className="flex flex-col gap-4 items-center snap-x scroll-px-4 snap-mandatory scroll-smooth overflow-y-auto h-full">
            {matches.map((match: Match) => (
              <MatchResult
                key={match.id}
                id={match.id}
                player1={match.player1}
                player2={match.player2}
                score1={match.score1}
                score2={match.score2}
                outcome={match.outcome}
                date={match.date}
                userId={user?.id}
                onScoreSubmit={fetchLeague}
              />
            ))}
            </div>
        </Tabs.Content>
      </Tabs>
    </div>
  );
};

export default LeagueResultsTabs;
