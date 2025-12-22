import React from "react";
import { useUser } from "../hooks/useUser";

const ProfilePage: React.FC = () => {
  const { user } = useUser();

  const handleLogout = async () => {
    await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="preset-filled-surface-200-800 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Profile</h2>
        <div className="text-lg mb-6 text-center">{user!.name}</div>
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
