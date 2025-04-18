import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import LoadingCircle from "@/components/ui/LoadingCircle";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { IUser, IUserState, IWorkspaceState } from "@/redux/reducers/types";
import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { TbEdit } from "react-icons/tb";
import { useSelector } from "react-redux";
import InvitePeopleBtnWithModal from "../Profile/components/InvitePeopleBtnWithModal";
import PeopleItem from "../Profile/components/PeopleItem";
import CreateWorkspaceModal from "./components/CreateWorkspaceModal";
import DeleteWorkspaceModal from "./components/DeleteWorkspaceModal";

const SettingsView = () => {
    const workspaceState: IWorkspaceState = useSelector(
        (state: any) => state.workspace
    );
    const userState: IUserState = useSelector((state: any) => state.user);
    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] =
        useState<boolean>(false);
    const [showDeleteWorkspaceModal, setShowDeleteWorkspaceModal] =
        useState<boolean>(false);
    if (!workspaceState?.currentWorkspace) return null;
    return (
        <>
            <div className="py-4 space-y-8">
                <div className="flex gap-3">
                    <Avatar>
                        <AvatarImage
                            src={""}
                            alt={workspaceState?.currentWorkspace?.name}
                        />
                        <AvatarFallback>
                            {workspaceState?.currentWorkspace?.name?.charAt(0) +
                                "W"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="">
                        <h3 className="text-xl line-clamp-1">
                            {workspaceState?.currentWorkspace?.name}
                        </h3>
                        <div className="text-muted-foreground">
                            {`Created By: ${workspaceState?.currentWorkspace?.createdByDetails?.email}`}
                        </div>
                        <div className="text-muted-foreground">
                            {workspaceState?.currentWorkspace?.description}
                        </div>
                    </div>
                </div>

                {userState?.user?._id ===
                    workspaceState?.currentWorkspace?.createdBy && (
                    <div className="flex justify-end gap-3">
                        <Button
                            onClick={() => setShowCreateWorkspaceModal(true)}
                            variant={"secondary"}
                            className="flex gap-2 items-center justify-start hover:bg-foreground/10 dark:hover:bg-foreground/10"
                        >
                            <TbEdit />
                            <span>{"Edit"}</span>
                        </Button>
                        <Button
                            className="flex gap-2 items-center justify-start text-red-500 hover:text-red-500 hover:bg-red-200 dark:hover:bg-red-950"
                            variant="secondary"
                            onClick={() => setShowDeleteWorkspaceModal(true)}
                        >
                            <AiOutlineDelete />
                            <span>{"Delete"}</span>
                        </Button>
                    </div>
                )}
                <CreateWorkspaceModal
                    editMode
                    workspaceId={workspaceState?.currentWorkspace?._id}
                    isOpen={showCreateWorkspaceModal}
                    onClose={() => setShowCreateWorkspaceModal(false)}
                />
                <DeleteWorkspaceModal
                    workspaceId={workspaceState?.currentWorkspace?._id}
                    isOpen={showDeleteWorkspaceModal}
                    onClose={() => setShowDeleteWorkspaceModal(false)}
                />

                <div className="flex justify-between items-center gap-3">
                    <h3 className="text-muted-foreground">People</h3>
                    {userState?.user?._id ===
                        workspaceState?.currentWorkspace?.createdBy && (
                        <InvitePeopleBtnWithModal />
                    )}
                </div>

                {workspaceState?.loading ? (
                    <LoadingCircle className="size-5" />
                ) : workspaceState?.currentWorkspace.peopleDetails?.length ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">
                                    Name
                                </TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {workspaceState?.currentWorkspace.peopleDetails?.map(
                                (people: IUser, index) => (
                                    <PeopleItem key={index} people={people} />
                                )
                            )}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-muted-foreground">
                        No people in this workspace
                    </div>
                )}
            </div>
        </>
    );
};

export default SettingsView;
