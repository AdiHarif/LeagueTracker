import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Tabs } from "@skeletonlabs/skeleton-react";
import MatchResult from "../match/MatchResult";
import { useUser } from "../../hooks/useUser";
import { usePrivileges } from "../../hooks/usePrivileges";
import { useAppBar } from "../../hooks/useAppBar";
import { useLastLeague } from "../../hooks/useLastLeague";
import LoadingSpinner from "../common/LoadingSpinner";
import type { LeagueData, Standing, Match } from "../../types";

const LeagueResultsTabs: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [leagueData, setLeagueData] = useState<LeagueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const privileges = usePrivileges(user?.id);
  const { setTitle } = useAppBar();
  const { setLastLeagueId } = useLastLeague();

  const fetchLeague = useCallback(async () => {
    if (!id) {
      setError("No league ID provided");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/leagues/${id}`, {
        credentials: "include"
      });
      if (!res.ok) throw new Error("Failed to fetch league");
      const data = await res.json();
      setLeagueData(data);
      setTitle(data.league.name);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(false);
    }
  }, [id, setTitle]);

  useEffect(() => {
    setTitle(""); // Clear title while loading
    fetchLeague();
    // Save the current league ID
    if (id) {
      setLastLeagueId(id);
    }
    return () => setTitle(""); // Clear on unmount
  }, [fetchLeague, setTitle, id, setLastLeagueId]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full preset-glass-neutral rounded-xl md:rounded-2xl shadow-lg p-6">
        <LoadingSpinner message="Loading league data..." />
      </div>
    </div>
  );
  if (error) return <div className="preset-filled-error-200-800 p-8 rounded-xl text-center">Error: {error}</div>;
  if (!leagueData) return <div className="preset-filled-surface-200-800 p-8 rounded-xl text-center">No league data found.</div>;

  const { league, matches, standings } = leagueData;

  // Group matches by round
  const matchesByRound = matches.reduce((acc, match) => {
    const round = match.round;
    if (!acc[round]) {
      acc[round] = [];
    }
    acc[round].push(match);
    return acc;
  }, {} as Record<number, Match[]>);

  // Get sorted round numbers
  const sortedRounds = Object.keys(matchesByRound)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="w-full preset-glass-neutral rounded-xl md:rounded-2xl p-3 md:p-6">
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
                {standings.map((player: Standing, idx: number) => {
                  const isCurrentUser = user?.id === player.id;
                  const nameClass = isCurrentUser ? "underline font-semibold" : "font-semibold";

                  return (
                    <tr
                      key={player.id}
                      className={`${idx === 0 ? "preset-filled-success-100-900 font-bold" : ""} border-b border-surface-50-950 last:border-b-0`}
                    >
                      <td className={`p-3 md:p-5 ${nameClass} text-sm md:text-lg sticky left-0 z-10 whitespace-nowrap`}>{player.name}</td>
                      <td className="p-3 md:p-5 text-sm md:text-lg">{player.gamesPlayed}</td>
                      <td className="p-3 md:p-5 text-sm md:text-lg">{player.wins}</td>
                      <td className="p-3 md:p-5 text-sm md:text-lg">{player.draws}</td>
                      <td className="p-3 md:p-5 text-sm md:text-lg">{player.losses}</td>
                      <td className="p-3 md:p-5 text-sm md:text-lg">{player.points}</td>
                    </tr>
                  );
                })}
                </tbody>
            </table>
          </div>
        </Tabs.Content>
        <Tabs.Content value="matches">
            <div className="flex flex-col gap-6 items-center snap-x scroll-px-4 snap-mandatory scroll-smooth overflow-y-auto h-full">
            {sortedRounds.map((round) => (
              <div key={round} className="w-full flex flex-col gap-4 items-center">
                <div className="w-full flex items-center justify-center">
                  <div className="flex-1 h-px bg-surface-300-700 opacity-50"></div>
                  <span className="px-4 text-sm font-medium opacity-80 whitespace-nowrap">
                    Round {round}
                  </span>
                  <div className="flex-1 h-px bg-surface-300-700 opacity-50"></div>
                </div>
                {matchesByRound[round].map((match: Match) => (
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
                    userPrivileges={privileges ?? undefined}
                    leagueOwnerId={league.ownerId}
                    onScoreSubmit={fetchLeague}
                  />
                ))}
              </div>
            ))}
            </div>
        </Tabs.Content>
      </Tabs>
    </div>
  );
};

export default LeagueResultsTabs;
