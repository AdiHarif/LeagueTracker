import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import LoginPage from './LoginPage';
import LeagueResultsTabs from './LeagueResultsTabs';
import MatchHistory from './MatchHistory';
import NavigationBar from './NavigationBar';
import { ProtectedRoute } from './ProtectedRoute';
import { UserProvider } from './UserContext';
import './App.css';
import './presets.css';

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
    </UserProvider>
  );
}

export default App;
