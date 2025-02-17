import { useEffect } from "react";
import { IoIosMoon, IoIosSunny } from "react-icons/io";
import { useTheme } from "../hooks/useTheme";
import Button from "./ui/Button";

const ThemeBtn = () => {
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        document.documentElement.setAttribute(
            "data-theme",
            localStorage.theme === "dark" ||
                (!("theme" in localStorage) &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches)
                ? "dark"
                : "light"
        );
    }, [theme]);

    return (
        <Button
            className="fixed bottom-0 right-0 m-6 text-2xl"
            onClick={toggleTheme}
            variant="primary"
            roundness="full"
        >
            {theme === "light" ? <IoIosMoon /> : <IoIosSunny />}
        </Button>
    );
};

export default ThemeBtn;
