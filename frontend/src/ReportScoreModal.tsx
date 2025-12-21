import React, { useState } from "react";

interface PlayerInfo {
  id: number;
  name: string;
}

interface ReportScoreModalProps {
  matchId: number;
  player1: PlayerInfo;
  player2: PlayerInfo;
  onSuccess: () => void;
}

const ReportScoreModal: React.FC<ReportScoreModalProps> = ({
  matchId,
  player1,
  player2,
  onSuccess,
}) => {
  const [newScore1, setNewScore1] = useState<number>(0);
  const [newScore2, setNewScore2] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (newScore1 < 0 || newScore2 < 0) {
      alert("Scores must be non-negative");
      return;
    }
    if (newScore1 + newScore2 > 3) {
      alert("Total games cannot exceed 3 (best of 3)");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/match/${matchId}/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ score1: newScore1, score2: newScore2 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit score');
      }

      // Call onSuccess to refresh data and close modal
      onSuccess();
    } catch (error) {
      console.error("Failed to submit score:", error);
      alert(`Failed to submit score: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card preset-filled-surface-200-800 p-6 w-full max-h-[33vh] shadow-2xl flex flex-col overflow-auto z-50">
      <h3 className="text-xl font-bold mb-4 text-center">Report Match Score</h3>

      {/* Score Inputs */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className="flex flex-col items-center">
          <label className="text-sm mb-2 font-semibold">{player1.name}</label>
          <input
            type="number"
            min="0"
            max="2"
            value={newScore1}
            onChange={(e) => setNewScore1(parseInt(e.target.value) || 0)}
            className="input w-20 h-20 text-center text-2xl font-bold"
          />
        </div>
        <span className="text-3xl font-bold mt-6">-</span>
        <div className="flex flex-col items-center">
          <label className="text-sm mb-2 font-semibold">{player2.name}</label>
          <input
            type="number"
            min="0"
            max="2"
            value={newScore2}
            onChange={(e) => setNewScore2(parseInt(e.target.value) || 0)}
            className="input w-20 h-20 text-center text-2xl font-bold"
          />
        </div>
      </div>

      {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="btn preset-filled-success-500 flex-1 py-2 font-semibold"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
  );
};

export default ReportScoreModal;
