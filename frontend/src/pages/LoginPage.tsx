import React, { useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

const BACKEND_AUTH_URL = import.meta.env.VITE_OAUTH_CALLBACK_URL;

const LoginPage: React.FC = () => {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/table", { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card flex flex-col items-center justify-center preset-glass-neutral rounded-xl md:rounded-2xl space-y-4 w-full max-w-md">
        <h1 className="text-xl md:text-2xl font-bold text-center">
          Welcome to League Tracker
        </h1>
        <GoogleLogin
          theme="filled_blue"
          onSuccess={(credentialResponse) => {
        fetch(`${BACKEND_AUTH_URL}?token=${credentialResponse.credential}`, {
          credentials: "include",
        })
          .then((response) => {
            if (!response.ok) {
          throw new Error("Authentication failed");
            }
            window.location.reload();
          })
          .catch(() => {
            alert("Login Failed");
          });
          }}
          onError={() => {
        alert("Login Failed");
          }}
        />
      </div>
    </div>
  );
};

export default LoginPage;
