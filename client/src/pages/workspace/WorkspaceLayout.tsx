import ScrollToTopBtn from "@/components/ScrollToTopBtn";
import { useEffect, useRef, useState } from "react";
import SideBar, { SideBarBtn } from "./components/SideBar";

const WorkspaceLayout = ({ children }: { children: React.ReactNode }) => {
    const [showSideBar, setShowSideBar] = useState<boolean>(false);
    const contentAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const workspaceElement = document.getElementById("workspace");
        if (workspaceElement) {
            workspaceElement.scrollIntoView({ behavior: "smooth" });
        }
    }, []);

    return (
        <div className="relative h-dvh md:grid grid-cols-[auto_1fr] gap-0 overflow-hidden">
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
            <div
                ref={contentAreaRef}
                className="grid grid-cols-1 grid-rows-[auto_1fr] md:flex md:justify-center gap-4 h-full w-full bg-foreground/[3%] overflow-y-scroll p-4 pb-32"
            >
                <div id="workspace" className="w-full max-w-6xl">
                    {children}
                    <ScrollToTopBtn containerRef={contentAreaRef} />
                    <SideBarBtn showSideBar={showSideBar} onClick={() => setShowSideBar((p) => !p)} />
                </div>
                {/* xl screen only extra content right side bar */}
                {/* <Card className="hidden 2xl:block xl:sticky top-0 right-0  rounded-none w-60 h-fit">
                    <CardHeader>
                        <CardTitle>Extra Content</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">Extra Content</CardContent>
                </Card> */}
            </div>
        </div>
    );
};

export default WorkspaceLayout;
