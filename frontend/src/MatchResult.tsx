import React from "react";

interface PlayerInfo {
  id: number;
  name: string;
}

interface MatchResultProps {
  id: number;
  player1: PlayerInfo;
  player2: PlayerInfo;
  score1?: number | null;
  score2?: number | null;
  outcome: string;
  date?: string;
}

const MatchResult: React.FC<MatchResultProps> = ({ player1, player2, score1, score2, outcome, date }) => {
  let resultClass = "";
  // You can highlight the winner if you want, for now just color by outcome
  if (outcome === "PLAYER1_WINS") resultClass = "preset-filled-success-500";
  else if (outcome === "PLAYER2_WINS") resultClass = "preset-filled-error-500";
  else if (outcome === "DRAW") resultClass = "preset-filled-surface-200-800";
  else resultClass = "preset-filled-surface-200-800";

  return (
    <div
      className={`card w-full max-w-xl ${resultClass} p-4 text-center flex flex-col justify-center`}
    >
      <div className="flex items-center justify-center gap-4 flex-1">
        <span className="font-semibold">{player1.name}</span>
        <span className="font-medium min-w-[60px]">
          {score1 !== undefined && score2 !== undefined && score1 !== null && score2 !== null
            ? `${score1} - ${score2}`
            : <span className="text-yellow-700">vs</span>}
        </span>
        <span className="font-semibold">{player2.name}</span>
      </div>
      <div className="text-sm mt-2">
        ({date ? new Date(date).toLocaleDateString() : "TBD"})
      </div>
    </div>
  );
};

export default MatchResult;
