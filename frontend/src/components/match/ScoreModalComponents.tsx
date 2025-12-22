import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface ScoreControlProps {
  playerName: string;
  score: number;
  otherScore: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

/**
 * Score control component for incrementing/decrementing a player's score
 */
export const ScoreControl: React.FC<ScoreControlProps> = ({
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

interface ScoreDisplayProps {
  player1Name: string;
  player2Name: string;
  score1: number;
  score2: number;
  onScore1Increment: () => void;
  onScore1Decrement: () => void;
  onScore2Increment: () => void;
  onScore2Decrement: () => void;
}

/**
 * Layout component for displaying two score controls side by side
 */
export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  player1Name,
  player2Name,
  score1,
  score2,
  onScore1Increment,
  onScore1Decrement,
  onScore2Increment,
  onScore2Decrement,
}) => {
  return (
    <div className="flex items-start justify-center gap-6 mb-6">
      <ScoreControl
        playerName={player1Name}
        score={score1}
        otherScore={score2}
        onIncrement={onScore1Increment}
        onDecrement={onScore1Decrement}
      />

      <div className="text-3xl font-bold flex items-center" style={{ marginTop: '67px', height: '64px' }}>
        -
      </div>

      <ScoreControl
        playerName={player2Name}
        score={score2}
        otherScore={score1}
        onIncrement={onScore2Increment}
        onDecrement={onScore2Decrement}
      />
    </div>
  );
};

interface ScoreModalWrapperProps {
  title: string;
  children: React.ReactNode;
}

/**
 * Wrapper component for score modals with consistent styling
 */
export const ScoreModalWrapper: React.FC<ScoreModalWrapperProps> = ({ title, children }) => {
  return (
    <div className="card preset-filled-surface-200-800 p-6 w-[calc(100vw-0.5rem)] md:max-w-2xl shadow-2xl flex flex-col z-50">
      <h3 className="text-xl font-bold mb-4 text-center">{title}</h3>
      {children}
    </div>
  );
};
