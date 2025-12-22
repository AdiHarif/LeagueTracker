import { createContext } from "react";

export type UserPrivileges = 'USER' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  picture?: string;
  privileges?: UserPrivileges;
}

export interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const UserContext = createContext<UserContextType>({ user: null, loading: true, error: null });
