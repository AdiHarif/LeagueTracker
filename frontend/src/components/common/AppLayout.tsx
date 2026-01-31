import React from "react";
import AppBar from "./AppBar";
import NavigationBar from "./NavigationBar";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col w-full h-full">
      <AppBar />
      <main className="pb-16 md:pb-20 p-2 sm:p-4 lg:p-8">
        {children}
      </main>
      <NavigationBar />
    </div>
  );
};

export default AppLayout;
