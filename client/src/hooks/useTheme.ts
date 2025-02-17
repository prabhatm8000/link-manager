import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeProvider";

export const useTheme = () => {
    const context = useContext(ThemeContext);
    return context;
};
