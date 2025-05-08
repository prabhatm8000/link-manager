import { useEffect } from "react";
import { IoIosMoon, IoIosSunny } from "react-icons/io";
import useTheme from "../hooks/useTheme";
import { Button } from "./ui/button";

const ThemeBtn = () => {
    const { theme, toggleTheme, setTheme } = useTheme();

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark")

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
        <Button
            className="fixed bottom-0 right-0 m-6 text-2xl px-2 py-4 rounded-full z-50"
            onClick={toggleTheme}
            variant="default"
        >
            <div
                className={`transform ${
                    theme === "light" ? "rotate-0" : "rotate-180"
                } transition-all duration-300 ease-out`}
            >
                {theme === "light" ? (
                    <IoIosMoon className="size-5" />
                ) : (
                    <IoIosSunny className="size-5" />
                )}
            </div>
        </Button>
    );
};

export default ThemeBtn;
