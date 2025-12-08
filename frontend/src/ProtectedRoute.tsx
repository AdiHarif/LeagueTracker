import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuth } from './auth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth().then(({ authenticated }) => {
      setAuthenticated(authenticated);
      setLoading(false);
      if (!authenticated) {
        navigate('/login', { replace: true });
      }
    });
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  if (!authenticated) return null; // Prevent rendering children before redirect

  return <>{children}</>;
}
