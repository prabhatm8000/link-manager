import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { IWorkspace } from "../../../redux/reducers/types";

const WorkspaceItem = (props: {
    data: IWorkspace;
    className?: string;
    avatarSize?: "sm" | "md" | "lg";
    setActiveWorkspace?: (workspace: IWorkspace) => void;
}) => {
    return (
        <div
            className={`flex items-center gap-1 ${props.className}`}
            onClick={() => props?.setActiveWorkspace?.(props.data)}
            title={props.data?.name}
        >
            <Avatar>
                <AvatarImage
                    src={""}
                    alt={props.data?.name}
                />
                <AvatarFallback itemType="workspace">{props.data?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="truncate">{props.data?.name}</span>
        </div>
    );
};

export default WorkspaceItem;
