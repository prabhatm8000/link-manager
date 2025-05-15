import { useEffect } from "react";
import { IoSunnyOutline } from "react-icons/io5";
import { RiMoonClearLine } from "react-icons/ri";
import useTheme from "../hooks/useTheme";

const ThemeBtn = () => {
    const { theme, toggleTheme, setTheme } = useTheme();

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");

        const gettingTheme =
            localStorage.theme === "dark" ||
            (!("theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
                ? "dark"
                : "light";

        setTheme(gettingTheme);
        document.documentElement.setAttribute("data-theme", gettingTheme);
        root.classList.add(gettingTheme);
    }, [theme]);

    return (
        <div
            title="Ctrl + , -> to toggle theme"
            onClick={toggleTheme}
            className={`cursor-default transform text-muted-foreground ${
                theme === "light" ? "rotate-180" : "rotate-0"
            } transition-all duration-300 ease-out`}
        >
            {theme === "light" ? (
                <IoSunnyOutline className="size-5" />
            ) : (
                <RiMoonClearLine className="size-5" />
            )}
        </div>
    );
};

export default ThemeBtn;
