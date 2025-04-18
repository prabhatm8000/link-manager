import { useEffect, useState } from "react";
import SideBar, { SideBarHeader } from "./components/SideBar";

const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
    const [showSideBar, setShowSideBar] = useState<boolean>(false);
    // const { theme } = useTheme();
    useEffect(() => {
        const workspaceElement = document.getElementById("workspace");
        if (workspaceElement) {
            workspaceElement.scrollIntoView({ behavior: "smooth" });
        }
    }, []);

    return (
        <div className="relative h-screen md:grid grid-cols-[auto_1fr] gap-0 overflow-hidden">
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
            <div className="grid grid-cols-1 grid-rows-[auto_1fr] md:flex md:justify-center h-full w-full bg-foreground/[3%] overflow-auto p-4">
                <div id="workspace" className="w-full min-w-sm max-w-6xl">
                    <div className="block md:hidden -p-4 sticky top-0 bg-background/70 rounded-md backdrop-blur-xs z-20">
                        <SideBarHeader
                            show={showSideBar}
                            handleShow={() => setShowSideBar((p) => !p)}
                        />
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default WorkspaceLayout;
