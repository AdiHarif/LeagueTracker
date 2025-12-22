import { useState, useEffect } from "react";
import type { UserPrivileges } from "../contexts/UserContextDefinition";

/**
 * Custom hook to fetch user privileges from the backend
 * Only fetches when user is logged in
 * Returns null if not fetched or if fetch fails
 */
export const usePrivileges = (userId?: number): UserPrivileges | null => {
  const [privileges, setPrivileges] = useState<UserPrivileges | null>(null);

  useEffect(() => {
    if (userId) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/check/privileges`, {
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch privileges");
          return res.json();
        })
        .then((data) => {
          setPrivileges(data.privileges);
        })
        .catch((err) => {
          console.error("Failed to fetch privileges:", err);
          // Don't throw - privileges are optional
        });
    }
  }, [userId]);

  return privileges;
};
