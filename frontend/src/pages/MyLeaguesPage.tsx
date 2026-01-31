import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { useLastLeague } from "../hooks/useLastLeague";
import LoadingSpinner from "../components/common/LoadingSpinner";
import LeagueCard from "../components/league/LeagueCard";
import type { League } from "../types";
import { Dices } from "lucide-react";

const MyLeaguesPage: React.FC = () => {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const navigate = useNavigate();
  const { lastLeagueId } = useLastLeague();

  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/leagues`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch leagues");
        }

        const data = await res.json();
        setLeagues(data);
        
        // If there's a last viewed league and we have leagues, redirect to it
        if (lastLeagueId && data.length > 0) {
          // Check if the last league ID exists in the current leagues
          const leagueExists = data.some((league: League) => league.id.toString() === lastLeagueId);
          if (leagueExists) {
            navigate(`/leagues/${lastLeagueId}`, { replace: true });
            return;
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchLeagues();
  }, [lastLeagueId, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-full preset-glass-neutral rounded-xl md:rounded-2xl shadow-lg p-6">
          <LoadingSpinner message="Loading leagues..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full preset-filled-error-200-800 p-8 rounded-xl text-center">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full preset-glass-neutral rounded-xl md:rounded-2xl p-4 md:p-6">
      {leagues.length === 0 ? (
        // Empty State
        <div className="flex flex-col items-center justify-center py-16 preset-filled-surface-200-800 rounded-lg">
          <Dices className="w-16 h-16 md:w-20 md:h-20 mb-4 opacity-50" />
          <p className="text-lg md:text-xl text-center">
            You're not in any leagues yet
          </p>
        </div>
      ) : (
        // League Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {leagues.map((league) => (
            <LeagueCard
              key={league.id}
              id={league.id}
              name={league.name}
              ownerId={league.ownerId}
              currentUserId={user?.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyLeaguesPage;
