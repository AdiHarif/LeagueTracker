import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import LoadingSpinner from "../common/LoadingSpinner";

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

interface ScoreControlProps {
  playerName: string;
  score: number;
  otherScore: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const ScoreControl: React.FC<ScoreControlProps> = ({
  playerName,
  score,
  otherScore,
  onIncrement,
  onDecrement,
}) => {
  const canIncrement = score < 2 && score + otherScore < 3;
  const canDecrement = score > 0;

  return (
    <div className="flex flex-col items-center gap-1">
      <label className="text-sm font-semibold text-center">{playerName}</label>
      <button
        onClick={onIncrement}
        disabled={!canIncrement}
        className="btn preset-filled-surface-500 w-16 h-10 text-2xl font-bold disabled:opacity-30"
        aria-label={`Increment ${playerName} score`}
      >
        <ChevronUp size={28} strokeWidth={3} />
      </button>
      <div className="text-4xl font-bold w-16 h-16 flex items-center justify-center">
        {score}
      </div>
      <button
        onClick={onDecrement}
        disabled={!canDecrement}
        className="btn preset-filled-surface-500 w-16 h-10 text-2xl font-bold disabled:opacity-30"
        aria-label={`Decrement ${playerName} score`}
      >
        <ChevronDown size={28} strokeWidth={3} />
      </button>
    </div>
  );
};

const ReportScoreModal: React.FC<ReportScoreModalProps> = ({
  matchId,
  player1,
  player2,
  onSuccess,
}) => {
  const [scores, setScores] = useState({ score1: 0, score2: 0 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateScore = (player: 'score1' | 'score2', delta: number) => {
    setScores((prev) => ({
      ...prev,
      [player]: Math.max(0, prev[player] + delta),
    }));
  };

  const handleSubmit = async () => {
    const { score1, score2 } = scores;

    // Validation
    if (score1 < 0 || score2 < 0) {
      alert("Scores must be non-negative");
      return;
    }
    if (score1 + score2 > 3) {
      alert("Total games cannot exceed 3 (best of 3)");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/matches/${matchId}/score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ score1, score2 }),
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

  if (isSubmitting) {
    return (
      <div className="card preset-filled-surface-200-800 p-6 w-[calc(100vw-0.5rem)] md:max-w-2xl shadow-2xl flex flex-col z-50">
        <LoadingSpinner size="lg" message="Submitting score..." />
      </div>
    );
  }

  return (
    <div className="card preset-filled-surface-200-800 p-6 w-[calc(100vw-0.5rem)] md:max-w-2xl shadow-2xl flex flex-col z-50">
      <h3 className="text-xl font-bold mb-4 text-center">Report Match Score</h3>

      {/* Score Controls */}
      <div className="flex items-start justify-center gap-6 mb-6">
        <ScoreControl
          playerName={player1.name}
          score={scores.score1}
          otherScore={scores.score2}
          onIncrement={() => updateScore('score1', 1)}
          onDecrement={() => updateScore('score1', -1)}
        />

        <div className="text-3xl font-bold flex items-center" style={{ marginTop: '67px', height: '64px' }}>
          -
        </div>

        <ScoreControl
          playerName={player2.name}
          score={scores.score2}
          otherScore={scores.score1}
          onIncrement={() => updateScore('score2', 1)}
          onDecrement={() => updateScore('score2', -1)}
        />
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
