import React, { useState } from "react";
import LoadingSpinner from "../common/LoadingSpinner";
import { ScoreDisplay, ScoreModalWrapper } from "./ScoreModalComponents";
import { validateScores } from "../../utils/scoreValidation";

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
    const validation = validateScores(score1, score2);
    if (!validation.isValid) {
      alert(validation.error);
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
      <ScoreModalWrapper title="Report Match Score">
        <LoadingSpinner size="lg" message="Submitting score..." />
      </ScoreModalWrapper>
    );
  }

  return (
    <ScoreModalWrapper title="Report Match Score">
      {/* Score Controls */}
      <ScoreDisplay
        player1Name={player1.name}
        player2Name={player2.name}
        score1={scores.score1}
        score2={scores.score2}
        onScore1Increment={() => updateScore('score1', 1)}
        onScore1Decrement={() => updateScore('score1', -1)}
        onScore2Increment={() => updateScore('score2', 1)}
        onScore2Decrement={() => updateScore('score2', -1)}
      />

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="btn preset-filled-success-500 flex-1 py-2 font-semibold"
      >
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </ScoreModalWrapper>
  );
};

export default ReportScoreModal;
