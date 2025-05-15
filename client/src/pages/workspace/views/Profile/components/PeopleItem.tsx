import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/Card";
import LoadingCircle from "@/components/ui/LoadingCircle";
import type {
    IUser,
    IUserState,
    IWorkspaceState,
} from "@/redux/reducers/types";
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

    const showRemoveBtn =
        userState.user?._id === workspaceState?.currentWorkspace?.createdBy &&
        userState.user?._id !== props.people._id;

    return (
        <Card className={`py-2 ${props.className}`}>
            <CardContent className="flex items-center justify-between gap-2 px-2">
                <div className="flex items-center gap-2 ">
                    <Avatar>
                        <AvatarImage
                            src={props.people.profilePicture}
                            alt={props.people.name}
                        />
                        <AvatarFallback>
                            {props.people.name?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span>{props.people.name}</span>
                        <span className="text-xs line-clamp-1 text-muted-foreground">
                            {props.people.email}
                        </span>
                    </div>
                </div>
                {showRemoveBtn ? (
                    <Button
                        onClick={handleRemovePeople}
                        className="flex gap-2 px-4 items-center justify-center"
                        variant="destructive"
                        disabled={isRemoving}
                        size={"icon"}
                    >
                        {isRemoving ? (
                            <LoadingCircle className="size-5" />
                        ) : (
                            <CiCircleRemove className="size-5" />
                        )}
                    </Button>
                ) : (
                    <Button
                        onClick={handleRemovePeople}
                        className="flex gap-2 px-4 items-center justify-center text-xs"
                        variant="outline"
                        size={"icon"}
                        disabled
                    >
                        You
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

export default PeopleItem;
