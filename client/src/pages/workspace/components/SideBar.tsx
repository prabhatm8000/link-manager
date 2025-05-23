import ThemeBtn from "@/components/ThemeBtn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LoadingCircle from "@/components/ui/LoadingCircle";
import { useEffect, useState, type JSX } from "react";
import { HiCursorClick } from "react-icons/hi";
import { IoIosAdd, IoIosClose, IoIosLink, IoIosSettings } from "react-icons/io";
import { IoAnalytics } from "react-icons/io5";
import { TbMenu, TbSelector } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import TitleText from "../../../components/TitleText";
import { Button } from "../../../components/ui/button";
import type {
    IUserState,
    IWorkspace,
    IWorkspaceState,
} from "../../../redux/reducers/types";
import type { AppDispatch } from "../../../redux/store";
import {
    getAllWorkspaces,
    getWorkspaceById,
} from "../../../redux/thunks/workspaceThunks";
import SideBarUsageBars from "./SideBarUsageBars";

// #region SideBar
const SideBar = ({
    setShowSideBar,
    className,
}: {
    setShowSideBar: () => void;
    className?: string;
}) => {
    return (
        <div
            className={`w-60 h-full backdrop-blur-lg bg-background p-4 flex flex-col justify-between ${className}`}
        >
            <div className="flex flex-col gap-6">
                <SideBarHeader setShowSideBar={setShowSideBar} />
                <SideBarBody setShowSideBar={setShowSideBar} />
            </div>
            <SideBarUsageBars />
        </div>
    );
};

export default SideBar;
// #endregion SideBar

// #region Header
export const SideBarHeader = ({
    setShowSideBar,
}: {
    setShowSideBar: () => void;
}) => {
    const userState: IUserState = useSelector((state: any) => state.user);
    const [_, setSearchParams] = useSearchParams();
    const handleTabChange = (tab: SideBarTabType) => {
        setSearchParams((p) => {
            p.set("tab", tab);
            return p;
        });
        setShowSideBar();
    };
    return (
        <div className="flex items-center justify-between gap-2">
            <Link to={"/"}>
                <TitleText className="text-lg flex gap-2 justify-start items-center">
                    <IoIosLink />
                    <span>Ref.com</span>
                </TitleText>
            </Link>
            <div className="flex items-center gap-1">
                <ThemeBtn />
                <Avatar onClick={() => handleTabChange("profile")}>
                    <AvatarImage
                        src={userState?.user?.profilePicture || ""}
                        alt={userState?.user?.name || ""}
                    />
                    <AvatarFallback>
                        {userState?.user?.name?.charAt(0)}
                    </AvatarFallback>
                </Avatar>
            </div>
        </div>
    );
};
// #endregion Header

// #region Body
export type SideBarTabType =
    | "profile"
    | "links"
    | "events"
    | "analytics"
    | "settings";
const tabs: { title: string; value: SideBarTabType; icon: JSX.Element }[] = [
    { title: "Links", value: "links", icon: <IoIosLink /> },
    { title: "Analytics", value: "analytics", icon: <IoAnalytics /> },
    { title: "Events", value: "events", icon: <HiCursorClick /> },
    { title: "Settings", value: "settings", icon: <IoIosSettings /> },
];
const SideBarBody = ({ setShowSideBar }: { setShowSideBar: () => void }) => {
    const workspaceState: IWorkspaceState = useSelector(
        (state: any) => state.workspace
    );
    const dispatch = useDispatch<AppDispatch>();
    const [showWorkspaces, setShowWorkspaces] = useState<boolean>(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>(
        searchParams.get("workspaceId") || ""
    );
    const [currentTab, setCurrentTab] = useState<SideBarTabType>(
        (searchParams.get("tab") as SideBarTabType) || "links"
    );
    const handleActiveWorkspaceChange = (workspace: IWorkspace) => {
        // setShowWorkspaces(false);
        // setSelectedWorkspaceId(workspace._id);

        // doning a window reload on workspace change, [probably to reset state]
        if (workspace._id === selectedWorkspaceId) return;
        setSearchParams((prev) => {
            prev.set("workspaceId", workspace._id);
            return prev;
        });
        window.location.reload();
    };
    const handleTabChange = (tab: SideBarTabType) => {
        setSearchParams((prev) => {
            prev.set("tab", tab);
            return prev;
        });
        setShowSideBar();
    };

    // seting workspace and tab
    useEffect(() => {
        let workspaceId = searchParams.get("workspaceId") || "";
        let tab = (searchParams.get("tab") as SideBarTabType) || "links";
        if (!workspaceId && workspaceState.workspaces.length) {
            workspaceId = workspaceState.workspaces[0]?._id || "";
        }
        setSelectedWorkspaceId(workspaceId);
        setCurrentTab(tab);
    }, [searchParams, workspaceState.workspaces]);

    useEffect(() => {
        if (!workspaceState.loading) {
            dispatch(getAllWorkspaces());
        }
    }, []);

    // fetching current workspace
    useEffect(() => {
        if (selectedWorkspaceId) {
            dispatch(getWorkspaceById(selectedWorkspaceId)).then(() => {
                setSearchParams((prev) => {
                    prev.set("workspaceId", selectedWorkspaceId);
                    return prev;
                });
            });
        }
    }, [selectedWorkspaceId]);

    return (
        <div className="flex flex-col gap-6">
            {workspaceState.currentWorkspace ? (
                <Button
                    onClick={() => setShowWorkspaces((p) => !p)}
                    className="flex items-center justify-between w-full"
                    variant={"outline"}
                >
                    <div className="flex items-center gap-2 truncate">
                        <Avatar>
                            <AvatarImage
                                src={""}
                                alt={workspaceState.currentWorkspace?.name}
                            />
                            <AvatarFallback itemType="workspace">
                                {workspaceState.currentWorkspace?.name.charAt(
                                    0
                                )}
                            </AvatarFallback>
                        </Avatar>
                        <span className="truncate">
                            {workspaceState.currentWorkspace?.name}
                        </span>
                    </div>
                    <TbSelector className="opacity-50" />
                </Button>
            ) : (
                <Button
                    variant="ghost"
                    onClick={() => handleTabChange("profile")}
                    className="flex gap-2 items-center justify-center w-full"
                >
                    {workspaceState.loading ? (
                        <LoadingCircle className="size-5" />
                    ) : (
                        "No workspace. Create one!"
                    )}
                </Button>
            )}

            {/* select workspaces or tab */}
            {showWorkspaces ? (
                <div>
                    <h4 className="text-muted-foreground mb-2">Workspaces</h4>
                    <div className="flex flex-col gap-1 max-h-80 h-80 overflow-y-auto">
                        {workspaceState.workspaces.map((workspace, index) => (
                            <Button
                                key={index}
                                onClick={() =>
                                    handleActiveWorkspaceChange(workspace)
                                }
                                className={`line-clamp-1 relative flex items-center justify-start gap-1 ${
                                    selectedWorkspaceId === workspace._id
                                        ? "bg-muted-foreground/15 text-foreground"
                                        : ""
                                }`}
                                variant={"ghost"}
                            >
                                <Avatar className="shrink-0">
                                    <AvatarFallback itemType="workspace">
                                        {workspace?.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="truncate">
                                    {workspace?.name}
                                </span>
                            </Button>
                        ))}
                        {currentTab !== "profile" && (
                            <Button
                                variant="ghost"
                                onClick={() => handleTabChange("profile")}
                                className="flex gap-2 items-center justify-center w-full"
                            >
                                <IoIosAdd className="size-5" />
                                <span>Create workspace</span>
                            </Button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col text-muted-foreground font-semibold text-sm">
                    {tabs.map((tab, index) => (
                        <Button
                            key={index}
                            onClick={() => handleTabChange(tab.value)}
                            variant="ghost"
                            className={`relative flex items-center justify-start gap-1 ${
                                currentTab === tab.value
                                    ? "bg-muted-foreground/15 text-foreground"
                                    : ""
                            }`}
                        >
                            {currentTab === tab.value && (
                                <span className="bg-muted-foreground h-4 w-1 rounded-full absolute left-0 top-1/2 transform -translate-y-1/2" />
                            )}
                            {tab.icon}
                            <span>{tab.title}</span>
                        </Button>
                    ))}
                </div>
            )}
        </div>
    );
};
// #endregion Body

export const SideBarBtn = ({ showSideBar, onClick }: {showSideBar: boolean, onClick: () => void}) => {
    return (
        <Button
            variant={"outline"}
            className="fixed top-0 right-0 m-6 md:hidden transition-all duration-300 ease-out z-50"
            onClick={onClick}
            size={"icon"}
        >
            <div
                className={`transform ${
                    showSideBar ? "rotate-0" : "rotate-360"
                } transition-all duration-500 ease-in-out`}
            >
                {showSideBar ? (
                    <IoIosClose className="size-8" />
                ) : (
                    <TbMenu className="size-5" />
                )}
            </div>
        </Button>
    );
};
