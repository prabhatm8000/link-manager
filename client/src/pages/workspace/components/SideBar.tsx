import { useEffect, useState, type JSX } from "react";
import { HiCursorClick } from "react-icons/hi";
import { IoIosLink, IoIosSettings } from "react-icons/io";
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
import CreateWorkspaceBtnWithModal from "./CreateWorkspaceBtnWithModal";
import SideBarUsageBars from "./SideBarUsageBars";
import WorkspaceItem from "./WorkspaceItem";

// #region SideBar
const SideBar = () => {
    const userState: IUserState = useSelector((state: any) => state.user);
    return (
        <div className="w-64 bg-black/10 dark:bg-white/10 p-2 flex flex-col justify-between">
            <div className="flex flex-col gap-6">
                <SideBarHeader userState={userState} />
                <SideBarBody />
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
const SideBarHeader = ({ userState }: { userState: IUserState }) => {
    const [_, setSearchParams] = useSearchParams();
    const handleTabChange = (tab: SideBarTabType) => {
        setSearchParams((p) => {
            p.set("tab", tab);
            return p;
        });
    };
    return (
        <div className="flex items-end justify-between gap-2">
            <Link to={"/"} className="">
                <TitleText
                    className="text-xl flex gap-2 justify-start items-center"
                >
                    <IoIosLink />
                    <span>Ref.com</span>
                </TitleText>
            </Link>
            <Avatar
                props={{
                    src: userState?.user?.profilePicture || undefined,
                    alt: userState?.user?.name,
                    className: "w-12 h-12 cursor-pointer",
                    onClick: () => handleTabChange("profile"),
                }}
                title={userState?.user?.name || "U"}
                size="md"
            />
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
const SideBarBody = () => {
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
                <CreateWorkspaceBtnWithModal />
            )}

            {showWorkspaces ? (
                <div className="flex flex-col gap-2 max-h-80 h-80 overflow-y-auto">
                    <span className="text-black/50 dark:text-white/50">
                        Workspaces
                    </span>
                    <CreateWorkspaceBtnWithModal />
                    {workspaceState.workspaces.map((workspace, index) => (
                        <WorkspaceItem
                            key={index}
                            data={workspace}
                            className="p-2 cursor-pointer"
                            avatarSize="md"
                            setActiveWorkspace={handleActiveWorkspaceChange}
                        />
                    ))}
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
