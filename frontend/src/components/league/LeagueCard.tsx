import React from "react";
import { useNavigate } from "react-router-dom";
import { Crown } from "lucide-react";

interface LeagueCardProps {
  id: number;
  name: string;
  ownerId: number;
  currentUserId?: number;
}

const LeagueCard: React.FC<LeagueCardProps> = ({
  id,
  name,
  ownerId,
  currentUserId,
}) => {
  const navigate = useNavigate();
  const isOwner = currentUserId === ownerId;

  const handleClick = () => {
    navigate(`/leagues/${id}`);
  };

  return (
    <button
      onClick={handleClick}
      className="card w-full preset-filled-surface-200-800 hover:preset-tonal-primary p-6 md:p-8 text-center flex flex-col justify-center items-center relative transition-all duration-200 hover:scale-105 hover:shadow-xl"
    >
      {/* Owner Badge */}
      {isOwner && (
        <div className="absolute top-3 right-3" title="League Owner">
          <Crown className="w-5 h-5 md:w-6 md:h-6 text-warning-500" />
        </div>
      )}

      {/* League Name */}
      <h3 className="text-lg md:text-xl font-bold wrap-break-word px-2">
        {name}
      </h3>
    </button>
  );
};

export default LeagueCard;
