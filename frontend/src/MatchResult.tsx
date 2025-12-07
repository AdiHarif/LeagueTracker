import React from "react";

interface PlayerInfo {
  uuid: string;
  name: string;
}

interface MatchResultProps {
  match_id: string;
  player1: PlayerInfo;
  player2: PlayerInfo;
  played: boolean;
  score: { player1: number; player2: number } | null;
  date?: string;
}

// Hardcoded current logged in player id
const CURRENT_PLAYER_ID = "b1a7e2c0-1f2d-4e3a-9c1a-2d3e4f5a6b7c";

const MatchResult: React.FC<MatchResultProps> = ({ player1, player2, played, score, date }) => {
  let resultClass = "";
  if (played && score) {
    if (player1.uuid === CURRENT_PLAYER_ID) {
      resultClass = "preset-filled-success-500";
      if (score.player1 <= score.player2) resultClass = "preset-filled-error-500";
    } else if (player2.uuid === CURRENT_PLAYER_ID) {
      resultClass = "preset-filled-success-500";
      if (score.player2 <= score.player1) resultClass = "preset-filled-error-500";
    } else {
      resultClass = "preset-filled-surface-200-800";
    }
  } else {
    resultClass = "preset-filled-surface-200-800";
  }

  return (
    <div
      className={`card w-full max-w-xl ${resultClass} p-4 text-center flex flex-col justify-center`}
    >
      <div className="flex items-center justify-center gap-4 flex-1">
        <span className="font-semibold">{player1.name}</span>
        <span className="font-medium min-w-[60px]">
          {played && score ? `${score.player1} - ${score.player2}` : <span className="text-yellow-700">vs</span>}
        </span>
        <span className="font-semibold">{player2.name}</span>
      </div>
      <div className="text-sm mt-2">
        ({played && date ? date : "TBD"})
      </div>
    </div>
  );
};

export default MatchResult;
