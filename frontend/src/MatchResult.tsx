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
  userId?: number;
}

const MatchResult: React.FC<MatchResultProps> = ({ player1, player2, score1, score2, outcome, date, userId }) => {
  let resultClass = "preset-filled-surface-200-800";
  if (userId) {
    if (outcome === "PLAYER1_WINS" && userId === player1.id) resultClass = "preset-filled-success-500";
    else if (outcome === "PLAYER2_WINS" && userId === player2.id) resultClass = "preset-filled-success-500";
    else if ((outcome === "PLAYER1_WINS" && userId === player2.id) || (outcome === "PLAYER2_WINS" && userId === player1.id)) resultClass = "preset-filled-error-500";
    else if (outcome === "DRAW") resultClass = "preset-filled-surface-200-800";
  } else {
    if (outcome === "PLAYER1_WINS") resultClass = "preset-filled-success-500";
    else if (outcome === "PLAYER2_WINS") resultClass = "preset-filled-error-500";
    else if (outcome === "DRAW") resultClass = "preset-filled-surface-200-800";
  }

  const player1Class = userId === player1.id ? "underline font-semibold" : "font-semibold";
  const player2Class = userId === player2.id ? "underline font-semibold" : "font-semibold";

  return (
    <div
      className={`card w-full max-w-xl ${resultClass} p-4 text-center flex flex-col justify-center`}
    >
      <div className="flex items-center justify-center gap-4 flex-1">
        <span className={player1Class}>{player1.name}</span>
        <span className="font-medium min-w-[60px]">
          {score1 !== undefined && score2 !== undefined && score1 !== null && score2 !== null
            ? `${score1} - ${score2}`
            : <span className="text-yellow-700">vs</span>}
        </span>
        <span className={player2Class}>{player2.name}</span>
      </div>
      <div className="text-sm mt-2">
        ({date ? new Date(date).toLocaleDateString() : "TBD"})
      </div>
    </div>
  );
};

export default MatchResult;
