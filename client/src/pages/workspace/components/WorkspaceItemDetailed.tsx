import { useSelector } from "react-redux";
import Avatar from "../../../components/Avatar";
import type { IUserState, IWorkspace } from "../../../redux/reducers/types";
import CreateWorkspaceBtnWithModal from "./CreateWorkspaceBtnWithModal";
import DeleteWorkspacebtnWithModal from "./DeleteWorkspacebtnWithModal";

const WorkspaceItemDetailed = (props: {
    data: IWorkspace;
    className?: string;
    avatarSize?: "sm" | "md" | "lg";
    setActiveWorkspace?: (workspace: IWorkspace) => void;
}) => {
    const userState: IUserState = useSelector((state: any) => state.user);
    return (
        <div
            className={`grid grid-cols-[auto_1fr_auto] items-start gap-1 p-1 rounded-md bg-black/10 dark:bg-white/10 ${props.className}`}
        >
            <div className="relative p-1 rounded-md w-full h-full">
                <Avatar
                    props={{ alt: props.data?.name }}
                    size={props.avatarSize || "lg"}
                    title={props.data?.name || "W"}
                />
            </div>

            <div
                onClick={() => props?.setActiveWorkspace?.(props.data)}
                title={props.data?.name}
                className="flex flex-col gap-1 p-1 rounded-md w-full h-full"
            >
                <h3>{props.data?.name}</h3>
                <div className="relative text-xs text-black/50 dark:text-white/50">
                    <span className="absolute top-[15%]">
                        <Avatar
                            props={{ alt: userState?.user?.name }}
                            size="sm"
                            title={userState?.user?.name || "U"}
                        />
                    </span>
                    <span className="pl-5 pb-">{userState?.user?.email}</span>
                </div>

                <p className="text-xs text-black/50 dark:text-white/50">
                    {props.data.description}
                </p>
            </div>

            {userState.user?._id === props.data?.createdBy && (
                <div className="rounded-md w-full h-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 p-1">
                        <CreateWorkspaceBtnWithModal
                            editMode
                            dontShowBtnText
                            workspaceId={props.data?._id}
                        />
                        <DeleteWorkspacebtnWithModal
                            dontShowBtnText
                            workspaceId={props.data?._id}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkspaceItemDetailed;
