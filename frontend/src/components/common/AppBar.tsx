import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppBar as SkeletonAppBar } from "@skeletonlabs/skeleton-react";
import { ArrowLeft } from "lucide-react";
import { useAppBar } from "../../hooks/useAppBar";
import { useLastLeague } from "../../hooks/useLastLeague";

const AppBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { title } = useAppBar();
  const { setLastLeagueId } = useLastLeague();

  const getPageTitle = () => {
    // For league detail pages, only show custom title (empty while loading)
    if (location.pathname.startsWith("/leagues/") && location.pathname !== "/leagues") {
      return title;
    }

    // Use custom title if set, otherwise determine by path
    if (title) return title;

    // Otherwise determine title by path
    switch (location.pathname) {
      case "/leagues":
        return "My Leagues";
      case "/history":
        return "My Matches";
      case "/profile":
        return "Profile";
      default:
        return "Sealed League Tracker";
    }
  };

  const showBackButton = location.pathname.startsWith("/leagues/") && location.pathname !== "/leagues";

  const handleBack = () => {
    setLastLeagueId(null); // Clear the last league ID when going back
    navigate("/leagues");
  };

  return (
    <SkeletonAppBar className="sticky top-0 z-40 flex flex-row items-center">
      <SkeletonAppBar.Lead className="flex justify-start items-center shrink-0">
        {showBackButton && (
          <button
            onClick={handleBack}
            className="hover:preset-tonal-primary transition-colors rounded-md"
            style={{ color: '#646cff' }}
            aria-label="Back to My Leagues"
            title="Back to My Leagues"
          >
            <ArrowLeft size={24} />
          </button>
        )}
      </SkeletonAppBar.Lead>
      <SkeletonAppBar.Headline className="flex-1 flex justify-center items-center">
        <h1 className="text-lg md:text-xl font-bold text-center truncate" style={{ color: '#646cff' }}>
          {getPageTitle()}
        </h1>
      </SkeletonAppBar.Headline>
      <SkeletonAppBar.Trail className="shrink-0" />
    </SkeletonAppBar>
  );
};

export default AppBar;
