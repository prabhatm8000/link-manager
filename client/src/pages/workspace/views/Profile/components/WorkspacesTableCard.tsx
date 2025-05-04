import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";
import LoadingCircle from "@/components/ui/LoadingCircle";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { IWorkspaceState } from "@/redux/reducers/types";
import { useState } from "react";
import { MdAdd } from "react-icons/md";
import { useSelector } from "react-redux";
import CreateWorkspaceModal from "../../Settings/components/CreateWorkspaceModal";
import WorkspaceItemDetailed from "../../Settings/components/WorkspaceItemDetailed";

const WorkspacesTableCard = () => {
    const workspaceState: IWorkspaceState = useSelector(
        (state: any) => state.workspace
    );
    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] =
        useState<boolean>(false);
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Your Workspaces</CardTitle>
                    <CardDescription className="flex gap-2 justify-between items-end">
                        <span>Wanna create a new workspace?</span>
                        <Button
                            onClick={() => setShowCreateWorkspaceModal(true)}
                            variant={"default"}
                            className="flex gap-2 items-center justify-start"
                        >
                            <MdAdd />
                            <span>{"Create Workspace"}</span>
                        </Button>
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
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
                </CardContent>
            </Card>

            <CreateWorkspaceModal
                isOpen={showCreateWorkspaceModal}
                onClose={() => setShowCreateWorkspaceModal(false)}
            />
        </>
    );
};

export default WorkspacesTableCard;
