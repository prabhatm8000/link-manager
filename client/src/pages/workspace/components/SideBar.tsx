import { useEffect, useState, type JSX } from "react";
import { HiCursorClick } from "react-icons/hi";
import {
    IoIosAdd,
    IoIosClose,
    IoIosLink,
    IoIosMenu,
    IoIosSettings,
} from "react-icons/io";
import { IoAnalytics } from "react-icons/io5";
import { TbSelector } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import Avatar from "../../../components/Avatar";
import TitleText from "../../../components/TitleText";
import Button from "../../../components/ui/Button";
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
            className={`w-64 h-full backdrop-blur-lg bg-white dark:bg-black p-2 flex flex-col justify-between ${className}`}
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
                    variant={show ? "danger-outline" : "outline"}
                    className="md:hidden transition-all duration-300 ease-out"
                    onClick={handleShow}
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
                <Avatar
                    props={{
                        src: userState?.user?.profilePicture || undefined,
                        alt: userState?.user?.name,
                        className: "w-12 h-12 cursor-pointer md:hidden",
                        onClick: () => handleTabChange("profile"),
                    }}
                    title={userState?.user?.name || "U"}
                    size="md"
                />
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
        setShowWorkspaces(false);
        setSelectedWorkspaceId(workspace._id);
    };
    const handleTabChange = (tab: SideBarTabType) => {
        setSearchParams((prev) => {
            prev.set("tab", tab);
            return prev;
        });
        setShowSideBar();
    };

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
                    variant="none"
                >
                    <WorkspaceItem
                        data={workspaceState.currentWorkspace}
                        avatarSize="md"
                    />
                    <TbSelector className="opacity-50" />
                </Button>
            ) : (
                <Button
                    variant="none"
                    onClick={() => handleTabChange("profile")}
                    className="flex gap-2 items-center justify-center w-full"
                >
                    No workspace. Create one!
                </Button>
            )}

            {/* select workspaces or tab */}
            {showWorkspaces ? (
                <div>
                    <h4 className="text-black/50 dark:text-white/50">
                        Workspaces
                    </h4>
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
                        <Button
                            variant="none"
                            onClick={() => handleTabChange("profile")}
                            className="flex gap-2 items-center justify-center w-full"
                        >
                            <IoIosAdd className="size-5" />
                            <span>Create workspace</span>
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col text-black/50 dark:text-white/50 font-semibold text-sm">
                    {tabs.map((tab, index) => (
                        <Button
                            key={index}
                            onClick={() => handleTabChange(tab.value)}
                            variant="none"
                            className={`flex items-center gap-1 ${
                                currentTab === tab.value ? "text-blue-500" : ""
                            }`}
                        >
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
