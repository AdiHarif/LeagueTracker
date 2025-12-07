import React from "react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simulate login and redirect to table view
    navigate("/table");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <h1>Welcome to Sealed League Tracker</h1>
      <button
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#4285F4",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "20px"
        }}
        onClick={handleLogin}
      >
        Login with Google
      </button>
    </div>
  );
};

export default LoginPage;
