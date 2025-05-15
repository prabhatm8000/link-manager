import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/Card";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { IWorkspace } from "../../../redux/reducers/types";

const WorkspaceItem = (props: {
    data: IWorkspace;
    className?: string;
    avatarSize?: "sm" | "md" | "lg";
    showDescription?: boolean;
    setWorkspaceOnClick?: boolean;
}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [extend, setExtend] = useState(false);
    const handleSelectWorkspace = () => {
        setSearchParams((prev) => {
            prev.set("workspaceId", props.data._id);
            return prev;
        });
        window.location.reload();
    };
    const selected = searchParams.get("workspaceId") === props.data._id
    return (
        <Card
            className={`py-2 cursor-pointer ${props.className}`}
            onClick={() =>
                setExtend((prev) => !prev)
            }
        >
            <CardContent className="flex items-center justify-between gap-2 px-2">
                <div className="flex items-center gap-2 ">
                    <Avatar title={props.data?.name}>
                        <AvatarImage src={""} alt={props.data?.name} />
                        <AvatarFallback itemType="workspace">
                            {props.data?.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <span className="truncate" title={props.data?.name}>
                            {props.data?.name}
                        </span>
                        {props.showDescription && (
                            <p
                                className={`${extend ? "" : "line-clamp-1"} w-full text-muted-foreground text-sm`}
                                title={props.data?.description}
                            >
                                {props.data?.description}
                            </p>
                        )}
                    </div>
                </div>
                {(props.setWorkspaceOnClick) && (
                    <Button variant={"outline"} disabled={selected} onClick={handleSelectWorkspace}>
                        {selected ? "Selected" : "Select"}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

export default WorkspaceItem;
