import { IoIosTrash } from "react-icons/io";
import Avatar from "../../../components/Avatar";
import Button from "../../../components/ui/Button";
import type { IUserState, IWorkspace } from "../../../redux/reducers/types";
import CreateWorkspaceBtnWithModal from "./CreateWorkspaceBtnWithModal";
import { useSelector } from "react-redux";
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
            className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-2 rounded-md bg-black/10 dark:bg-white/10 ${props.className}`}
        >
            <div className="relative">
                <Avatar
                    props={{ alt: props.data?.name }}
                    size={props.avatarSize || "lg"}
                    title={props.data?.name || "W"}
                />
            </div>
            <div
                onClick={() => props?.setActiveWorkspace?.(props.data)}
                title={props.data?.name}
                className="flex flex-col gap-1"
            >
                <h3>{props.data?.name}</h3>
                <div className="flex gap-1 items-start text-xs text-black/50 dark:text-white/50">
                    <Avatar
                        props={{ alt: userState?.user?.name }}
                        size="sm"
                        title={userState?.user?.name || "U"}
                    />
                    <span>{userState?.user?.email}</span>
                </div>

                <p className="text-xs text-black/50 dark:text-white/50">
                    {props.data.description}
                </p>
            </div>
            {userState.user?._id === props.data?.createdBy && (
                <div className="grid grid-cols-2 gap-2">
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
            )}
        </div>
    );
};

export default WorkspaceItemDetailed;
