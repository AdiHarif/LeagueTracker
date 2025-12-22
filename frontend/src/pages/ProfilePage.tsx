import React, { useState } from "react";
import { useUser } from "../hooks/useUser";
import LoadingSpinner from "../components/common/LoadingSpinner";

const ProfilePage: React.FC = () => {
  const { user } = useUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    window.location.reload();
  };

  if (isLoggingOut) {
    return <LoadingSpinner fullScreen message="Logging out..." />;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="preset-filled-surface-200-800 rounded-xl shadow-lg p-6 md:p-8 w-full max-w-md">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">Profile</h2>
        <div className="text-base md:text-lg mb-6 text-center wrap-break-word">{user!.name}</div>
        <button
          className="btn btn-lg btn-error w-full"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
