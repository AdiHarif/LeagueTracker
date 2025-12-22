import React from "react";
import { Dialog, Portal } from "@skeletonlabs/skeleton-react";
import { NotebookPen, Settings } from "lucide-react";
import ReportScoreModal from "./ReportScoreModal";
import EditScoreModal from "./EditScoreModal";
import type { UserPrivileges } from "../../contexts/UserContextDefinition";

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
  userPrivileges?: UserPrivileges;
  leagueOwnerId?: number;
  onScoreSubmit?: () => void;
}

const MatchResult: React.FC<MatchResultProps> = ({ 
  id, 
  player1, 
  player2, 
  score1, 
  score2, 
  outcome, 
  date, 
  userId, 
  userPrivileges,
  leagueOwnerId,
  onScoreSubmit 
}) => {
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
  const hasScore = !hasNoScore;
  
  // Determine if user is admin or league owner
  const isAdmin = userPrivileges === 'ADMIN';
  const isLeagueOwner = leagueOwnerId !== undefined && userId === leagueOwnerId;
  const isAdminOrOwner = isAdmin || isLeagueOwner;

  // Players can report scores for their own matches (if no score exists)
  const canReport = isPlayerInMatch && hasNoScore && onScoreSubmit;
  
  // Admins and league owners can edit any match score (if score exists)
  const canEdit = isAdminOrOwner && hasScore && onScoreSubmit;

  const handleSuccess = () => {
    if (onScoreSubmit) {
      onScoreSubmit();
    }
  };

  return (
    <div
      className={`card w-full max-w-xl ${resultClass} p-3 md:p-4 text-center flex flex-col justify-center relative`}
    >
      <div className="flex items-center justify-center flex-1 gap-2 md:gap-0">
        <div className="flex-1 flex justify-end pr-2">
          <span className={`${player1Class} text-sm md:text-base truncate`}>{player1.name}</span>
        </div>
        <span className="font-medium min-w-12 md:min-w-16 text-center shrink-0 grow-0 text-sm md:text-base">
          {score1 !== undefined && score2 !== undefined && score1 !== null && score2 !== null
            ? `${score1} - ${score2}`
            : <span className="text-primary-800-200">vs</span>}
        </span>
        <div className="flex-1 flex justify-start pl-2">
          <span className={`${player2Class} text-sm md:text-base truncate`}>{player2.name}</span>
        </div>
      </div>
      <div className="text-xs md:text-sm mt-2">
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
              <NotebookPen />
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

      {/* Edit Score Icon Button (Admin/Owner only) */}
      {canEdit && (
        <Dialog>
          <Dialog.Trigger>
            <button
              className="absolute top-2 right-2 btn-icon btn-sm hover:preset-filled-warning-500 opacity-60 hover:opacity-100 transition-opacity"
              title="Edit Score (Admin/Owner)"
              aria-label="Edit Score"
            >
              <Settings />
            </button>
          </Dialog.Trigger>

          <Portal>
            <Dialog.Backdrop className="fixed inset-0 z-50 bg-surface-50-950/70" />
            <Dialog.Positioner className="fixed inset-0 z-50 flex justify-center items-center p-4">
              <Dialog.Content>
                <EditScoreModal
                  matchId={id}
                  player1={player1}
                  player2={player2}
                  currentScore1={score1!}
                  currentScore2={score2!}
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
