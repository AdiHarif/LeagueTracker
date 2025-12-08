import React from "react";
import { GoogleLogin } from "@react-oauth/google";

const BACKEND_AUTH_URL = import.meta.env.VITE_OAUTH_CALLBACK_URL;

const LoginPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="mb-8 text-2xl font-bold">
        Welcome to Sealed League Tracker
      </h1>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          window.location.href = `${BACKEND_AUTH_URL}?token=${credentialResponse.credential}`;
        }}
        onError={() => {
          alert("Login Failed");
        }}
      />
    </div>
  );
};

export default LoginPage;
