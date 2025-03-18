import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { MdOutlineWorkspaces } from "react-icons/md";
import { SlOptionsVertical } from "react-icons/sl";
import { TbEdit } from "react-icons/tb";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Avatar from "../../../components/Avatar";
import type { IUserState, IWorkspace } from "../../../redux/reducers/types";
import CreateWorkspaceModal from "./CreateWorkspaceModal";
import DeleteWorkspaceModal from "./DeleteWorkspaceModal";

const WorkspaceItemDetailed = (props: {
    data: IWorkspace;
    className?: string;
    avatarSize?: "sm" | "md" | "lg";
    setActiveWorkspace?: (workspace: IWorkspace) => void;
}) => {
    const userState: IUserState = useSelector((state: any) => state.user);
    const [_, setSearchParams] = useSearchParams();
    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] =
        useState<boolean>(false);
    const [showDeleteWorkspaceModal, setShowDeleteWorkspaceModal] =
        useState<boolean>(false);
    const handleSelectWorkspace = () => {
        setSearchParams((prev) => {
            prev.set("workspaceId", props.data._id);
            return prev;
        });
    };
    return (
        <TableRow className="group">
            <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                    <Avatar
                        props={{ alt: props.data?.name }}
                        size={props.avatarSize || "lg"}
                        title={props.data?.name || "W"}
                    />
                    <span>{props.data.name}</span>
                </div>
            </TableCell>
            <TableCell>{props.data.description}</TableCell>
            <TableCell className="text-right">
                {userState.user?._id === props.data?.createdBy && (
                    <div className="rounded-md w-full h-full">
                        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 p-1"></div> */}
                        <DropdownMenu>
                            <DropdownMenuTrigger className="p-1">
                                <SlOptionsVertical className="size-4 opacity-50" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem
                                    onClick={handleSelectWorkspace}
                                    variant={"default"}
                                    className="flex gap-2 items-center justify-start w-full hover:bg-foreground/10 dark:hover:bg-foreground/10"
                                >
                                    <MdOutlineWorkspaces />
                                    <span>Select</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() =>
                                        setShowCreateWorkspaceModal(true)
                                    }
                                    variant={"default"}
                                    className="flex gap-2 items-center justify-start w-full hover:bg-foreground/10 dark:hover:bg-foreground/10"
                                >
                                    <TbEdit />
                                    <span>{"Edit"}</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="flex gap-2 items-center justify-start w-full hover:bg-red-200 dark:hover:bg-red-950"
                                    variant="destructive"
                                    onClick={() =>
                                        setShowDeleteWorkspaceModal(true)
                                    }
                                >
                                    <AiOutlineDelete className="text-red-500" />
                                    <span>{"Delete"}</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
                <CreateWorkspaceModal
                    editMode
                    workspaceId={props.data?._id}
                    isOpen={showCreateWorkspaceModal}
                    onClose={() => setShowCreateWorkspaceModal(false)}
                />

                <DeleteWorkspaceModal
                    workspaceId={props.data?._id}
                    isOpen={showDeleteWorkspaceModal}
                    onClose={() => setShowDeleteWorkspaceModal(false)}
                />
            </TableCell>
        </TableRow>
    );
};

export default WorkspaceItemDetailed;
