import { Link, useLocation, useNavigate } from "react-router-dom";
import { Navigation } from "@skeletonlabs/skeleton-react";
import { Table2, Gamepad2, User } from 'lucide-react';
import { useLastLeague } from "../../hooks/useLastLeague";

const navItems = [
  { label: "My Leagues", to: "/leagues", icon: Table2 },
  { label: "My Matches", to: "/history", icon: Gamepad2 },
  { label: "Profile", to: "/profile", icon: User },
];

const NavigationBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { lastLeagueId } = useLastLeague();

  const barHeight = 20;

  const handleNavClick = (to: string, e: React.MouseEvent) => {
    // If clicking "My Leagues" and we have a last league ID, navigate to it
    if (to === "/leagues" && lastLeagueId) {
      e.preventDefault();
      navigate(`/leagues/${lastLeagueId}`);
    }
  };

  return (
    <Navigation layout="bar" className={`w-full h-${barHeight} fixed bottom-0 left-0 z-50`}>
      <Navigation.Menu className="flex w-full justify-between">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to || 
            (item.to === "/leagues" && location.pathname.startsWith("/leagues/"));
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={(e) => handleNavClick(item.to, e)}
              className={`flex flex-col items-center flex-1 text-center text-primary-500 py-2 ${isActive ? "preset-tonal" : ""}`}
            >
              <Icon size={24} className="md:w-8 md:h-8" />
              <span className="text-xs md:text-base whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </Navigation.Menu>
    </Navigation>
  );
};

export default NavigationBar;
