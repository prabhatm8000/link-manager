import TitleText from "@/components/TitleText";
import { Button } from "@/components/ui/button";
import LoadingCircle from "@/components/ui/LoadingCircle";
import Modal from "@/components/ui/Modal";
import type { IWorkspace, IWorkspaceState } from "@/redux/reducers/types";
import type { AppDispatch } from "@/redux/store";
import { deleteWorkspace } from "@/redux/thunks/workspaceThunks";
import { useEffect, useState } from "react";
import { MdWorkspacesOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const DeleteWorkspaceModal = ({
    workspaceId,
    isOpen,
    onClose,
}: {
    workspaceId: string;
    isOpen: boolean;
    onClose: () => void;
}) => {
    const mainText = "Delete Workspace";
    const workspaceState: IWorkspaceState = useSelector(
        (state: any) => state.workspace
    );
    const dispatch = useDispatch<AppDispatch>();
    const [workspace, setWorkspace] = useState<IWorkspace>();
    const handleDeleteBtn = () => {
        if (!workspace) return;
        dispatch(deleteWorkspace(workspace._id)).then(() => onClose());
    };

    useEffect(() => {
        if (!workspaceId || workspace) return;
        const ws = workspaceState.workspaces.find(
            (workspace) => workspace._id === workspaceId
        );
        if (ws) {
            setWorkspace(ws);
        }
    }, [workspaceId, workspaceState.workspaces]);

    return (
        <>
            <Modal
                variant="outline"
                roundness="light"
                isOpen={isOpen}
                onClose={onClose}
            >
                <div className="flex items-center gap-2 mb-4">
                    <MdWorkspacesOutline className="size-6" />
                    <TitleText className="text-xl">{mainText}</TitleText>
                </div>
                <div className="flex flex-col items-center gap-4">
                    <p className="text-sm text-center text-muted-foreground">
                        {
                            "Are you sure you want to delete this workspace and all associated data (links, people, etc.)?\nThis action cannot be undone."
                        }
                    </p>
                    <Button
                        className="flex gap-2 items-center w-fit"
                        variant="destructive"
                        onClick={handleDeleteBtn}
                    >
                        {workspaceState.loading && (
                            <LoadingCircle className="size-5" />
                        )}
                        <span>{mainText}</span>
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default DeleteWorkspaceModal;
