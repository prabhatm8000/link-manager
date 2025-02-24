import Avatar from "../../../components/Avatar";
import type { IWorkspace } from "../../../redux/reducers/types";

const WorkspaceItem = (props: {
    data: IWorkspace;
    className?: string;
    avatarSize?: "sm" | "md" | "lg";
    setActiveWorkspace?: (workspace: IWorkspace) => void;
}) => {
    return (
        <div
            className={`flex items-center gap-2 ${props.className}`}
            onClick={() => props?.setActiveWorkspace?.(props.data)}
            title={props.data?.name}
        >
            <Avatar
                props={{ alt: props.data?.name }}
                size={props.avatarSize || "lg"}
                title={props.data?.name || "W"}
            />
            <span>{props.data?.name}</span>
        </div>
    );
};

export default WorkspaceItem;
