import { useEffect, useState } from "react";
import SideBar, { SideBarHeader } from "./components/SideBar";

const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
    const [showSideBar, setShowSideBar] = useState<boolean>(true);
    useEffect(() => {
        const workspaceElement = document.getElementById("workspace");
        if (workspaceElement) {
            workspaceElement.scrollIntoView({ behavior: "smooth" });
        }
    }, []);

    return (
        <div className="relative h-screen md:grid grid-cols-[auto_1fr] gap-4">
            <div
                onClick={() => setShowSideBar(false)}
                className={`${
                    showSideBar ? "fixed" : "hidden"
                } md:hidden z-40 top-0 left-0 w-full h-full bg-black/50 backdrop-blur-[1px]`}
            />

            <SideBar
                className={`fixed md:static z-50 top-0 left-0 transition-transform duration-500 ease-out ${
                    showSideBar
                        ? "translate-x-0"
                        : "-translate-x-[100%] md:translate-x-0"
                }`}
                setShowSideBar={() => setShowSideBar((p) => !p)}
                showSideBar={showSideBar}
            />

            <div className="grid grid-cols-1 grid-rows-[auto_1fr] md:flex md:justify-center h-full w-full ">
                <div className="block md:hidden px-4 py-2">
                    <SideBarHeader
                        show={showSideBar}
                        handleShow={() => setShowSideBar((p) => !p)}
                    />
                </div>
                <div
                    id="workspace"
                    className="h-full w-full py-2 px-6 md:px-4 min-w-sm md:max-w-xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl"
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export default WorkspaceLayout;
