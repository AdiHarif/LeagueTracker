import { createContext } from "react";

export interface User {
  id: number;
  name: string;
  email: string;
  picture?: string;
}

export interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const UserContext = createContext<UserContextType>({ user: null, loading: true, error: null });
