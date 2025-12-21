import { useContext } from "react";
import { UserContext } from "../contexts/UserContextDefinition";

export const useUser = () => useContext(UserContext);
