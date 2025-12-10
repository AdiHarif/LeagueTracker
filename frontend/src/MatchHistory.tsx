import React, { useEffect, useState } from "react";
import MatchResult from "./MatchResult";

const MatchHistory: React.FC = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <div className="preset-filled-primary-100-800 p-8 rounded-xl text-center">Loading...</div>;
  if (error) return <div className="preset-filled-error-100-800 p-8 rounded-xl text-center">Error: {error}</div>;

  return (
    <div className="w-full max-w-xl mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4 text-center preset-filled-primary-500">My Match History</h2>
      {sortedMatches.length === 0 && <div className="text-center">No matches found.</div>}
      {sortedMatches.map(match => (
        <div className="m-4" key={match.id}>
          <MatchResult {...match} />
        </div>
      ))}
    </div>
  );
};

export default MatchHistory;
