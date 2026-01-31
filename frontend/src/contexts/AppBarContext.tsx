import { createContext, useState } from "react";
import type { ReactNode } from "react";

interface AppBarContextType {
  title: string;
  setTitle: (title: string) => void;
}

export const AppBarContext = createContext<AppBarContextType | undefined>(undefined);

export const AppBarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [title, setTitle] = useState("");

  return (
    <AppBarContext.Provider value={{ title, setTitle }}>
      {children}
    </AppBarContext.Provider>
  );
};
