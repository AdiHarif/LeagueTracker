import { useContext } from 'react';
import { LastLeagueContext } from '../contexts/LastLeagueContext';

export const useLastLeague = () => {
  const context = useContext(LastLeagueContext);
  if (context === undefined) {
    throw new Error('useLastLeague must be used within a LastLeagueProvider');
  }
  return context;
};
