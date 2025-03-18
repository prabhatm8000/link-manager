import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { useSelector } from "react-redux";
import Avatar from "../../../components/Avatar";
import LoadingCircle from "../../../components/ui/LoadingCircle";
import type {
    IUser,
    IUserState,
    IWorkspaceState,
} from "../../../redux/reducers/types";
import CreateWorkspaceModal from "../components/CreateWorkspaceModal";
import DeleteWorkspaceModal from "../components/DeleteWorkspaceModal";
import InvitePeopleBtnWithModal from "../components/InvitePeopleBtnWithModal";
import PeopleItem from "../components/PeopleItem";
import ViewHeader from "../components/ViewHeader";
import { TbEdit } from "react-icons/tb";

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
            <ViewHeader
                heading="Settings"
                subHeading="Manage your workspace settings"
            />
            <div className="py-4 space-y-8">
                <div className="flex gap-3">
                    <Avatar
                        props={{
                            alt: workspaceState?.currentWorkspace?.name,
                        }}
                        size={"lg"}
                        title={workspaceState?.currentWorkspace?.name || "W"}
                    />
                    <div className="">
                        <h3 className="text-xl line-clamp-1">
                            {workspaceState?.currentWorkspace?.name}
                        </h3>
                        <div className="text-black/50 dark:text-white/50">
                            {`Created By: ${workspaceState?.currentWorkspace?.createdByDetails?.email}`}
                        </div>
                        <div className="text-black/50 dark:text-white/50">
                            {workspaceState?.currentWorkspace?.description}
                        </div>
                    </div>
                </div>

                {userState?.user?._id ===
                    workspaceState?.currentWorkspace?.createdBy && (
                    <div className="grid grid-cols-2 sm:flex justify-center sm:justify-end gap-3">
                        <Button
                            onClick={() => setShowCreateWorkspaceModal(true)}
                            variant={"ghost"}
                            className="flex gap-2 items-center justify-start hover:bg-foreground/10 dark:hover:bg-foreground/10"
                        >
                            <TbEdit />
                            <span>{"Edit"}</span>
                        </Button>
                        <Button
                            className="flex gap-2 items-center justify-start text-red-500 hover:text-red-500 hover:bg-red-200 dark:hover:bg-red-950"
                            variant="ghost"
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

                <div className="flex justify-center flex-col sm:flex-row sm:justify-between gap-3">
                    <h3 className="text-black/50 dark:text-white/50">People</h3>
                    {userState?.user?._id ===
                        workspaceState?.currentWorkspace?.createdBy && (
                        <InvitePeopleBtnWithModal />
                    )}
                </div>

                {workspaceState?.loading ? (
                    <LoadingCircle className="size-5" />
                ) : workspaceState?.currentWorkspace.peopleDetails?.length ? (
                    <div>
                        {workspaceState?.currentWorkspace.peopleDetails?.map(
                            (people: IUser, index) => (
                                <PeopleItem key={index} people={people} />
                            )
                        )}
                    </div>
                ) : (
                    <div className="text-black/50 dark:text-white/50">
                        No people in this workspace
                    </div>
                )}
            </div>
        </>
    );
};

export default SettingsView;
