import React from "react";
import { Dialog, Portal } from "@skeletonlabs/skeleton-react";
import { SquarePen } from "lucide-react";
import ReportScoreModal from "./ReportScoreModal";

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
  onScoreSubmit?: () => void;
}

const MatchResult: React.FC<MatchResultProps> = ({ id, player1, player2, score1, score2, outcome, date, userId, onScoreSubmit }) => {
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

  const isPlayerInMatch = userId === player1.id || userId === player2.id;
  const hasNoScore = score1 === null || score1 === undefined || score2 === null || score2 === undefined;
  const canReport = isPlayerInMatch && hasNoScore && onScoreSubmit;

  const handleSuccess = () => {
    if (onScoreSubmit) {
      onScoreSubmit();
    }
  };

  return (
    <div
      className={`card w-full max-w-xl ${resultClass} p-4 text-center flex flex-col justify-center relative`}
    >
      <div className="flex items-center justify-center flex-1">
        <div className="flex-1 flex justify-end">
          <span className={player1Class}>{player1.name}</span>
        </div>
        <span className="font-medium min-w-16 text-center shrink-0 grow-0">
          {score1 !== undefined && score2 !== undefined && score1 !== null && score2 !== null
            ? `${score1} - ${score2}`
            : <span className="text-primary-800-200">vs</span>}
        </span>
        <div className="flex-1 flex justify-start">
          <span className={player2Class}>{player2.name}</span>
        </div>
      </div>
      <div className="text-sm mt-2">
        ({date ? new Date(date).toLocaleDateString() : "TBD"})
      </div>

      {/* Report Score Icon Button */}
      {canReport && (
        <Dialog>
          <Dialog.Trigger>
            <button
              className="absolute top-2 right-2 btn-icon btn-sm hover:preset-filled-primary-500 opacity-60 hover:opacity-100 transition-opacity"
              title="Report Score"
              aria-label="Report Score"
            >
              <SquarePen />
            </button>
          </Dialog.Trigger>

          <Portal>
            <Dialog.Backdrop className="fixed inset-0 z-50 bg-surface-50-950/70" />
            <Dialog.Positioner className="fixed inset-0 z-50 flex justify-center items-center p-4">
              <Dialog.Content>
                <ReportScoreModal
                  matchId={id}
                  player1={player1}
                  player2={player2}
                  onSuccess={handleSuccess}
                />
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog>
      )}
    </div>
  );
};

export default MatchResult;
