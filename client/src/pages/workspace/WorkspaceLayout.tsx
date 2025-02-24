import { useEffect } from "react";
import SideBar from "./components/SideBar";

const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
    useEffect(() => {
        const workspaceElement = document.getElementById("workspace");
        if (workspaceElement) {
            workspaceElement.scrollIntoView({ behavior: "smooth" });
        }
    }, []);

    return (
        <div className="grid grid-cols-[auto_1fr] gap-4 h-screen">
            <SideBar />
            <div className="flex justify-center w-full">
                <div
                    id="workspace"
                    className="h-full w-full p-2 min-w-sm md:max-w-xl lg:max-w-3xl xl:max-w-5xl 2xl:max-w-6xl"
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export default WorkspaceLayout;
