import { useEffect } from "react";
import { IoIosMoon, IoIosSunny } from "react-icons/io";
import useTheme from "../hooks/useTheme";
import Button from "./ui/Button";

const ThemeBtn = () => {
    const { theme, toggleTheme, setTheme } = useTheme();

    useEffect(() => {
        const gettingTheme =
            localStorage.theme === "dark" ||
            (!("theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
                ? "dark"
                : "light";

                setTheme(gettingTheme);
        document.documentElement.setAttribute("data-theme", gettingTheme);
    }, [theme]);

    return (
        <Button
            className="fixed bottom-0 right-0 m-4 text-2xl"
            onClick={toggleTheme}
            variant="primary"
            roundness="full"
        >
            <div
                className={`transform ${
                    theme === "light" ? "rotate-0" : "rotate-180"
                } transition-all duration-300 ease-out`}
            >
                {theme === "light" ? <IoIosMoon /> : <IoIosSunny />}
            </div>
        </Button>
    );
};

export default ThemeBtn;
