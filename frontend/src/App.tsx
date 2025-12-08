import { Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import LeagueResultsTabs from './LeagueResultsTabs';
import MatchHistory from './MatchHistory';
import NavigationBar from './NavigationBar';
import { ProtectedRoute } from './ProtectedRoute';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <NavigationBar>
              <Routes>
                <Route path="/table" element={<LeagueResultsTabs />} />
                <Route path="/history" element={<MatchHistory />} />
              </Routes>
            </NavigationBar>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
