import React, { createContext, useState } from 'react';
import type { ReactNode } from 'react';

interface LastLeagueContextType {
  lastLeagueId: string | null;
  setLastLeagueId: (id: string | null) => void;
}

export const LastLeagueContext = createContext<LastLeagueContextType | undefined>(undefined);

export const LastLeagueProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lastLeagueId, setLastLeagueId] = useState<string | null>(null);

  return (
    <LastLeagueContext.Provider value={{ lastLeagueId, setLastLeagueId }}>
      {children}
    </LastLeagueContext.Provider>
  );
};
