import { useContext } from "react";
import { AppBarContext } from "../contexts/AppBarContext";

export const useAppBar = () => {
  const context = useContext(AppBarContext);
  if (!context) {
    throw new Error("useAppBar must be used within AppBarProvider");
  }
  return context;
};
