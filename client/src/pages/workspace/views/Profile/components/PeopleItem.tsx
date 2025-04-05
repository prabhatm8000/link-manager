import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import LoadingCircle from "@/components/ui/LoadingCircle";
import { TableCell, TableRow } from "@/components/ui/table";
import type { IUser, IUserState, IWorkspaceState } from "@/redux/reducers/types";
import type { AppDispatch } from "@/redux/store";
import { removePeople } from "@/redux/thunks/workspaceThunks";
import { useState } from "react";
import { CiCircleRemove } from "react-icons/ci";
import { useDispatch, useSelector } from "react-redux";

const PeopleItem = (props: {
    people: IUser;
    className?: string;
    avatarSize?: "sm" | "md" | "lg";
}) => {
    const [isRemoving, setIsRemoving] = useState<boolean>(false);
    const userState: IUserState = useSelector((state: any) => state.user);
    const workspaceState: IWorkspaceState = useSelector(
        (state: any) => state.workspace
    );
    const dispatch = useDispatch<AppDispatch>();
    const handleRemovePeople = () => {
        setIsRemoving(true);
        dispatch(
            removePeople({
                workspaceId: workspaceState?.currentWorkspace?._id as string,
                peopleId: props.people._id,
            })
        ).finally(() => setIsRemoving(false));
    };
    return (
        <TableRow>
            <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage
                            src={props.people.profilePicture}
                            alt={props.people.name}
                        />
                        <AvatarFallback>
                            {props.people.name?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <span>{props.people.name}</span>
                </div>
            </TableCell>
            <TableCell>{props.people.email}</TableCell>
            <TableCell className="float-right">
                {userState.user?._id ===
                workspaceState?.currentWorkspace?.createdBy ? (
                    <Button
                        onClick={handleRemovePeople}
                        className="flex gap-2 px-4 items-center justify-center"
                        variant="destructive"
                    >
                        {isRemoving ? (
                            <LoadingCircle className="size-5" />
                        ) : (
                            <CiCircleRemove className="size-5" />
                        )}
                        <span>{isRemoving ? "Removing..." : "Remove"}</span>
                    </Button>
                ) : (
                    <>huh?</>
                )}
            </TableCell>
        </TableRow>
    );
};

export default PeopleItem;
