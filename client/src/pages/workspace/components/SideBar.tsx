import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LoadingCircle from "@/components/ui/LoadingCircle";
import { useEffect, useState, type JSX } from "react";
import { HiCursorClick } from "react-icons/hi";
import {
    IoIosAdd,
    IoIosClose,
    IoIosLink,
    IoIosMenu,
    IoIosSettings,
} from "react-icons/io";
import { IoAnalytics, IoPersonOutline } from "react-icons/io5";
import { TbSelector } from "react-icons/tb";
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
import WorkspaceItem from "./WorkspaceItem";

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
            className={`w-64 h-full backdrop-blur-lg bg-background p-2 flex flex-col justify-between ${className}`}
        >
            <div className="flex flex-col gap-6">
                <SideBarHeader />
                <SideBarBody setShowSideBar={setShowSideBar} />
            </div>
            <SideBarUsageBars
                data={[
                    { label: "Events", count: 3243, total: 10000 },
                    { label: "Links", count: 10, total: 25 },
                    { label: "Workspaces", count: 1, total: 10 },
                ]}
            />
        </div>
    );
};

export default SideBar;
// #endregion SideBar

// #region Header
export const SideBarHeader = ({
    show,
    handleShow,
}: {
    show?: boolean;
    handleShow?: () => void;
}) => {
    const userState: IUserState = useSelector((state: any) => state.user);
    const [_, setSearchParams] = useSearchParams();
    const handleTabChange = (tab: SideBarTabType) => {
        setSearchParams((p) => {
            p.set("tab", tab);
            return p;
        });
    };
    return (
        <div className="flex items-end justify-between gap-2">
            <Link to={"/"}>
                <TitleText className="text-xl flex gap-2 justify-start items-center">
                    <IoIosLink />
                    <span>Ref.com</span>
                </TitleText>
            </Link>
            {handleShow ? (
                <Button
                    variant={show ? "destructive" : "outline"}
                    className="md:hidden transition-all duration-300 ease-out z-50"
                    onClick={handleShow}
                    size={"icon"}
                >
                    <div
                        className={`transform ${
                            show ? "rotate-0" : "rotate-180"
                        } transition-all duration-300 ease-out`}
                    >
                        {show ? (
                            <IoIosClose className="size-5" />
                        ) : (
                            <IoIosMenu className="size-5" />
                        )}
                    </div>
                </Button>
            ) : (
                <Avatar onClick={() => handleTabChange("profile")}>
                    <AvatarImage
                        src={userState?.user?.profilePicture || ""}
                        alt={userState?.user?.name || ""}
                    />
                    <AvatarFallback>
                        {userState?.user?.name?.charAt(0)}
                    </AvatarFallback>
                </Avatar>
            )}
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
    { title: "Events", value: "events", icon: <HiCursorClick /> },
    { title: "Analytics", value: "analytics", icon: <IoAnalytics /> },
    { title: "Profile", value: "profile", icon: <IoPersonOutline /> },
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

        // doning a window reload on workspace change, [probably to remove state]
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

    // fetching workspaces
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
                    variant={showWorkspaces ? "outline" :"ghost"}
                >
                    <WorkspaceItem
                        data={workspaceState.currentWorkspace}
                        avatarSize="md"
                    />
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
                    <h4 className="text-muted-foreground">Workspaces</h4>
                    <div className="flex flex-col gap-2 max-h-80 h-80 overflow-y-auto">
                        {workspaceState.workspaces.map((workspace, index) => (
                            <WorkspaceItem
                                key={index}
                                data={workspace}
                                className="p-2 cursor-pointer"
                                avatarSize="md"
                                setActiveWorkspace={handleActiveWorkspaceChange}
                            />
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
                                currentTab === tab.value ? "bg-muted-foreground/25 text-foreground" : ""
                            }`}
                        >
                            {currentTab === tab.value && <span className="bg-muted-foreground h-4 w-1 rounded-full absolute left-0 top-1/2 transform -translate-y-1/2" />}
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
