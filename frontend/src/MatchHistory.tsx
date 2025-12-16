import React, { useEffect, useState } from "react";
import MatchResult from "./MatchResult";
import { useUser } from "./UserContext";

const MatchHistory: React.FC = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/my-matches`, { credentials: "include" })
      .then((res) => {
      if (!res.ok) throw new Error("Failed to fetch matches");
      return res.json();
      })
      .then((data) => {
      setMatches(data.matches || []);
      setLoading(false);
      })
      .catch((err) => {
      setError(err.message);
      setLoading(false);
      });
  }, []);

  // Sort: played matches by date descending, then unplayed at the end
  const sortedMatches = [
    ...matches.filter(m => m.date && m.outcome !== 'TBD'),
    ...matches.filter(m => !m.date || m.outcome === 'TBD')
  ];

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="preset-filled-primary-200-800 p-8 rounded-xl shadow text-center text-lg font-semibold">
        Loading...
      </div>
    </div>
  );
  if (error) return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="preset-filled-error-200-800 p-8 rounded-xl shadow text-center text-lg font-semibold">
        Error: {error}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col items-center min-h-screen">
      <div className="w-full preset-glass-neutral rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">My Matches</h2>
        {sortedMatches.length === 0 && <div className="text-center">No matches found.</div>}
        <div className="flex flex-col gap-4 items-center">
          {sortedMatches.map(match => (
            <MatchResult {...match} key={match.id} userId={user?.id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MatchHistory;
