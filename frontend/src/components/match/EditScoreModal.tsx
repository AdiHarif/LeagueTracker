import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import LoadingSpinner from "../common/LoadingSpinner";
import { ScoreDisplay, ScoreModalWrapper } from "./ScoreModalComponents";
import { validateScores } from "../../utils/scoreValidation";

interface PlayerInfo {
  id: number;
  name: string;
}

interface EditScoreModalProps {
  matchId: number;
  player1: PlayerInfo;
  player2: PlayerInfo;
  currentScore1: number;
  currentScore2: number;
  onSuccess: () => void;
}

const EditScoreModal: React.FC<EditScoreModalProps> = ({
  matchId,
  player1,
  player2,
  currentScore1,
  currentScore2,
  onSuccess,
}) => {
  const [scores, setScores] = useState({ score1: currentScore1, score2: currentScore2 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);

  const updateScore = (player: 'score1' | 'score2', delta: number) => {
    setScores((prev) => ({
      ...prev,
      [player]: Math.max(0, prev[player] + delta),
    }));
  };

  const handleUpdate = async () => {
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
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ score1, score2 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update score');
      }

      // Call onSuccess to refresh data and close modal
      onSuccess();
    } catch (error) {
      console.error("Failed to update score:", error);
      alert(`Failed to update score: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/matches/${matchId}/score`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete score');
      }

      // Call onSuccess to refresh data and close modal
      onSuccess();
    } catch (error) {
      console.error("Failed to delete score:", error);
      alert(`Failed to delete score: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting) {
    return (
      <ScoreModalWrapper title="Edit Match Score">
        <LoadingSpinner size="lg" message={showDeleteConfirm ? "Deleting score..." : "Updating score..."} />
      </ScoreModalWrapper>
    );
  }

  if (showUpdateConfirm) {
    return (
      <ScoreModalWrapper title="Confirm Update">
        <p className="text-center mb-6">
          Are you sure you want to update this score?<br />
          <strong>{player1.name} {scores.score1} - {scores.score2} {player2.name}</strong>
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => setShowUpdateConfirm(false)}
            className="btn preset-filled-surface-500 flex-1 py-2 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="btn preset-filled-success-500 flex-1 py-2 font-semibold"
          >
            Update Score
          </button>
        </div>
      </ScoreModalWrapper>
    );
  }

  if (showDeleteConfirm) {
    return (
      <ScoreModalWrapper title="Confirm Delete">
        <p className="text-center mb-6">
          Are you sure you want to delete this match score? This will reset the match to TBD state.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="btn preset-filled-surface-500 flex-1 py-2 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="btn preset-filled-error-500 flex-1 py-2 font-semibold"
          >
            Delete Score
          </button>
        </div>
      </ScoreModalWrapper>
    );
  }

  return (
    <ScoreModalWrapper title="Edit Match Score">
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

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => {
            const validation = validateScores(scores.score1, scores.score2);
            if (!validation.isValid) {
              alert(validation.error);
              return;
            }
            setShowUpdateConfirm(true);
          }}
          disabled={isSubmitting}
          className="btn preset-filled-success-500 flex-1 py-2 font-semibold"
        >
          {isSubmitting ? "Updating..." : "Update Score"}
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          disabled={isSubmitting}
          className="btn preset-filled-error-500 px-4 py-2 font-semibold flex items-center gap-2"
          title="Delete Score"
        >
          <Trash2 size={20} />
          <span className="hidden md:inline">Delete</span>
        </button>
      </div>
    </ScoreModalWrapper>
  );
};

export default EditScoreModal;
