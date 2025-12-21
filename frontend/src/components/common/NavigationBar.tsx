import { Link, useLocation } from "react-router-dom";
import { Navigation } from "@skeletonlabs/skeleton-react";
import { Table2, Gamepad2, User } from 'lucide-react';

const navItems = [
  { label: "League Standings", to: "/table", icon: Table2 },
  { label: "My Matches", to: "/history", icon: Gamepad2 },
  { label: "Profile", to: "/profile", icon: User },
];

const NavigationBar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const barHeight = 20;

  return (
    <div className="flex flex-col w-full h-full">
      <main className="pb-12">
        {children}
      </main>
      <Navigation layout="bar" className={`w-full h-${barHeight} fixed bottom-0 left-0`}>
        <Navigation.Menu className="flex w-full justify-between">
          {navItems.map(item => {
        const Icon = item.icon;
        const isActive = location.pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center flex-1 text-center text-primary-500 ${isActive ? "preset-tonal" : ""}`}
          >
            <Icon size={32} />
            <span>{item.label}</span>
          </Link>
        );
          })}
        </Navigation.Menu>
      </Navigation>
    </div>
  );
};

export default NavigationBar;
