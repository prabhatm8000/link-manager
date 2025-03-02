import { useState } from "react";
import { CiCircleRemove } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../../../components/Avatar";
import Button from "../../../components/ui/Button";
import LoadingCircle from "../../../components/ui/LoadingCircle";
import type {
    IUser,
    IUserState,
    IWorkspaceState,
} from "../../../redux/reducers/types";
import type { AppDispatch } from "../../../redux/store";
import { removeTeamMember } from "../../../redux/thunks/workspaceThunks";

const MemberItem = (props: {
    member: IUser;
    className?: string;
    avatarSize?: "sm" | "md" | "lg";
}) => {
    const [isRemoving, setIsRemoving] = useState<boolean>(false);
    const userState: IUserState = useSelector((state: any) => state.user);
    const workspaceState: IWorkspaceState = useSelector(
        (state: any) => state.workspace
    );
    const dispatch = useDispatch<AppDispatch>();
    const handleRemoveMember = () => {
        setIsRemoving(true);
        dispatch(
            removeTeamMember({
                workspaceId: workspaceState?.currentWorkspace?._id as string,
                memberId: props.member._id,
            })
        ).finally(() => setIsRemoving(false));
    };
    return (
        <div
            className={`grid grid-cols-[auto_1fr_auto] items-start gap-1 p-1 rounded-md bg-black/10 dark:bg-white/10 ${props.className}`}
        >
            <div className="relative p-1 rounded-md w-full h-full">
                <Avatar
                    props={{
                        alt: props.member.name,
                        src: props.member.profilePicture,
                    }}
                    size={props.avatarSize || "md"}
                    title={props.member.name || "U"}
                />
            </div>

            <div
                className="flex flex-col gap-1 p-1 rounded-md w-full h-full"
                title={props.member.name}
            >
                <span>{props.member.name}</span>
                <span className="text-black/50 dark:text-white/50 text-sm">
                    {props.member.email}
                </span>
            </div>

            {userState.user?._id ===
                workspaceState?.currentWorkspace?.createdBy && (
                <div className="rounded-md w-full h-full">
                    <div className="grid grid-cols-1 p-1">
                        <Button
                            onClick={handleRemoveMember}
                            className="flex gap-2 px-4 items-center justify-center"
                            variant="danger"
                        >
                            {isRemoving ? (
                                <LoadingCircle className="size-5" />
                            ) : (
                                <CiCircleRemove className="size-5" />
                            )}
                            <span>{isRemoving ? "Removing..." : "Remove"}</span>
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MemberItem;
