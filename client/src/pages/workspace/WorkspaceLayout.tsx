import useTheme from "@/hooks/useTheme";
import { useEffect, useState } from "react";
import SideBar, { SideBarHeader } from "./components/SideBar";

const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
    const [showSideBar, setShowSideBar] = useState<boolean>(false);
    const { theme } = useTheme();
    useEffect(() => {
        const workspaceElement = document.getElementById("workspace");
        if (workspaceElement) {
            workspaceElement.scrollIntoView({ behavior: "smooth" });
        }
    }, []);

    return (
        <div className="relative h-screen md:grid grid-cols-[auto_1fr] gap-0">
            {/* black overlay, when sidebar is open, smaller screen */}
            <div
                onClick={() => setShowSideBar(false)}
                className={`${
                    showSideBar ? "fixed md:hidden" : "hidden"
                } z-40 top-0 left-0 w-full h-full bg-black/50 backdrop-blur-[1px]`}
            />

            <SideBar
                className={`fixed md:static z-50 top-0 left-0 transition-transform duration-500 ease-out ${
                    showSideBar
                        ? "translate-x-0"
                        : "-translate-x-[100%] md:translate-x-0"
                }`}
                setShowSideBar={() => setShowSideBar((p) => !p)}
            />

            {/* body */}
            <div className="grid grid-cols-1 grid-rows-[auto_1fr] md:flex md:justify-center h-full w-full bg-foreground/[3%]">
                <div className="block md:hidden p-4">
                    <SideBarHeader
                        show={showSideBar}
                        handleShow={() => setShowSideBar((p) => !p)}
                    />
                </div>
                <div
                    id="workspace"
                    className="h-full w-full p-4 min-w-sm 2xl:max-w-7xl"
                >
                    {children}
                </div>
            </div>

            {/* background image */}
            {/* <div className="fixed -z-10 top-0 left-0 w-full h-full bg-white dark:bg-black opacity-40">
                <img
                    src="/backgrounds/auth-light.jpg"
                    className={`w-full h-full object-cover ${
                        theme === "dark" ? "invert" : ""
                    }`}
                />
            </div> */}
        </div>
    );
};

export default WorkspaceLayout;
