import { Button } from "@/components/ui/button";
import LoadingCircle from "@/components/ui/LoadingCircle";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { IUserState, IWorkspaceState } from "@/redux/reducers/types";
import type { AppDispatch } from "@/redux/store";
import { getMyWorkspaces } from "@/redux/thunks/workspaceThunks";
import { useEffect, useState } from "react";
import { MdAdd } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import CreateWorkspaceModal from "../Settings/components/CreateWorkspaceModal";
import WorkspaceItemDetailed from "../Settings/components/WorkspaceItemDetailed";
import ProfileDetailCard from "./components/ProfileDetailCard";

const ProfileView = () => {
    const userState: IUserState = useSelector((state: any) => state.user);
    const workspaceState: IWorkspaceState = useSelector(
        (state: any) => state.workspace
    );
    const dispatch = useDispatch<AppDispatch>();
    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] =
        useState<boolean>(false);

    useEffect(() => {
        if (workspaceState.myWorkspaces.length > 0) return;
        dispatch(getMyWorkspaces());
    }, []);

    if (!userState?.user) return null;
    return (
        <>
            <div className="flex flex-col gap-4 w-full">
                <div className="space-y-8">
                    <ProfileDetailCard />

                    {/* my workspaces */}
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center gap-3">
                            <h3 className="text-muted-foreground">
                                My Workspaces
                            </h3>
                            <Button
                                onClick={() =>
                                    setShowCreateWorkspaceModal(true)
                                }
                                variant={"default"}
                                className="flex gap-2 items-center justify-start"
                            >
                                <MdAdd />
                                <span>{"Create Workspace"}</span>
                            </Button>
                        </div>

                        {workspaceState.loading ? (
                            <LoadingCircle className="size-5" />
                        ) : workspaceState.myWorkspaces.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">
                                            Name
                                        </TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {workspaceState.myWorkspaces.map(
                                        (item, index) => (
                                            <WorkspaceItemDetailed
                                                data={item}
                                                key={index}
                                                avatarSize="md"
                                            />
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        ) : (
                            <h3 className="text-muted-foreground">
                                You have not created any workspace yet!
                            </h3>
                        )}
                    </div>
                    <CreateWorkspaceModal
                        isOpen={showCreateWorkspaceModal}
                        onClose={() => setShowCreateWorkspaceModal(false)}
                    />
                </div>
            </div>
        </>
    );
};

export default ProfileView;
