import { Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import LeagueResultsTabs from './LeagueResultsTabs';
import MatchHistory from './MatchHistory';
import NavigationBar from './NavigationBar';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="*"
        element={
          <NavigationBar>
            <Routes>
              <Route path="/table" element={<LeagueResultsTabs />} />
              <Route path="/history" element={<MatchHistory />} />
            </Routes>
          </NavigationBar>
        }
      />
    </Routes>
  );
}

export default App;
