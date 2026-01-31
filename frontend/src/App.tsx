import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import MyLeaguesPage from './pages/MyLeaguesPage';
import LeagueResultsTabs from './components/league/LeagueResultsTabs';
import MatchHistory from './components/match/MatchHistory';
import AppLayout from './components/common/AppLayout';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { UserProvider } from './contexts/UserContext';
import { AppBarProvider } from './contexts/AppBarContext';
import './styles/App.css';
import './styles/presets.css';
import ProfilePage from './pages/ProfilePage';

function App() {
  // Set background image directly on body
  useEffect(() => {
    const bgUrl = import.meta.env.VITE_BACKGROUND_IMAGE_URL;
    if (bgUrl) {
      document.body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.15)), url('${bgUrl}')`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.minHeight = '100vh';
    }
    return () => {
      document.body.style.backgroundImage = '';
    };
  }, []);
  return (
    <UserProvider>
      <AppBarProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Routes>
                    <Route path="/leagues" element={<MyLeaguesPage />} />
                    <Route path="/leagues/:id" element={<LeagueResultsTabs />} />
                    <Route path="/history" element={<MatchHistory />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="*" element={<Navigate to="/leagues" replace />} />
                  </Routes>
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AppBarProvider>
    </UserProvider>
  );
}

export default App;
