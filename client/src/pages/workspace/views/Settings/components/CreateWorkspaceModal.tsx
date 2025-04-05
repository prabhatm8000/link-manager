import TitleText from "@/components/TitleText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingCircle from "@/components/ui/LoadingCircle";
import Modal from "@/components/ui/Modal";
import type { IWorkspace, IWorkspaceState } from "@/redux/reducers/types";
import type { AppDispatch } from "@/redux/store";
import {
    createWorkspace,
    updateWorkspace,
} from "@/redux/thunks/workspaceThunks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdWorkspacesOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

/**
 * workspaceId is used for edit mode, should be passed as a prop
 */
const CreateWorkspaceModal = ({
    editMode,
    workspaceId,
    isOpen,
    onClose,
}: {
    editMode?: boolean;
    workspaceId?: string;
    isOpen: boolean;
    onClose: () => void;
}) => {
    const mainText = editMode ? "Edit workspace" : "Create workspace";
    const [workspace, setWorkspace] = useState<IWorkspace>(); // edit mode only
    const [isChanged, setIsChanged] = useState<boolean>(false); // edit mode only
    const workspaceState: IWorkspaceState = useSelector(
        (state: any) => state.workspace
    );
    const dispatch = useDispatch<AppDispatch>();
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm();

    const onSubmit = handleSubmit((data) => {
        const { workspaceName, workspaceDescription } = data;
        if (editMode) {
            dispatch(
                updateWorkspace({
                    name: workspaceName,
                    description: workspaceDescription,
                    id: workspaceId as string,
                })
            ).then(() => onClose());
        } else {
            dispatch(
                createWorkspace({
                    name: workspaceName,
                    description: workspaceDescription,
                })
            ).then(() => onClose());
        }
    });

    const handleCloseModal = () => {
        onClose();
        setValue("workspaceName", workspace?.name || "");
        setValue("workspaceDescription", workspace?.description || "");
    };

    // edit mode: setting current workspace name and description
    useEffect(() => {
        if (!workspace && workspaceId && workspaceState.workspaces.length) {
            const workspace = workspaceState.workspaces.find(
                (workspace) => workspace._id === workspaceId
            );

            if (workspace) {
                setWorkspace(workspace);
                setValue("workspaceName", workspace.name);
                setValue("workspaceDescription", workspace.description);
            }
        }
    }, [workspaceState]);

    // edit mode: watching for changes
    useEffect(() => {
        if (!workspace) return;
        if (
            workspace.name !== watch("workspaceName") ||
            workspace.description !== watch("workspaceDescription")
        ) {
            setIsChanged(true);
        } else {
            setIsChanged(false);
        }
    }, [watch("workspaceName"), watch("workspaceDescription")]);

    return (
        <>
            <Modal
                roundness="light"
                isOpen={isOpen}
                onClose={handleCloseModal}
                variant="outline"
            >
                <div className="flex flex-col gap-8">
                    <div className="flex items-center gap-2">
                        <MdWorkspacesOutline className="size-6" />
                        <TitleText className="text-xl text-start">
                            {mainText}
                        </TitleText>
                    </div>
                    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                        <div className="flex flex-col gap-1 relative pb-4">
                            <Label htmlFor="workspaceName">
                                Workspace Name
                            </Label>
                            <Input
                                id="workspaceName"
                                type="text"
                                placeholder="Ex. My Workspace"
                                className="w-full"
                                maxLength={25}
                                {...register("workspaceName", {
                                    required: "Workspace name is required",
                                    minLength: {
                                        value: 3,
                                        message:
                                            "Workspace name must be at least 3 characters",
                                    },
                                    maxLength: {
                                        value: 25,
                                        message:
                                            "Workspace name must not exceed 25 characters",
                                    },
                                })}
                            />
                            {errors.workspaceName && (
                                <span className="text-red-500 text-xs absolute bottom-0">
                                    {errors.workspaceName.message as string}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-col gap-1 relative pb-4">
                            <Label htmlFor="workspaceDescription">
                                Workspace Description
                            </Label>
                            <Input
                                id="workspaceDescription"
                                type="text"
                                placeholder="Ex. My workspace for marketing"
                                className="w-full"
                                maxLength={200}
                                {...register("workspaceDescription", {
                                    maxLength: {
                                        value: 200,
                                        message:
                                            "Workspace description must not exceed 200 characters",
                                    },
                                })}
                            />
                            {errors.workspaceName && (
                                <span className="text-red-500 text-xs absolute bottom-0">
                                    {errors.workspaceName.message as string}
                                </span>
                            )}
                        </div>
                        <Button
                            type="submit"
                            disabled={
                                workspaceState.loading ||
                                (editMode && !isChanged)
                            }
                            className="my-2 flex gap-2 items-center justify-center"
                        >
                            {workspaceState.loading && (
                                <LoadingCircle className="size-5" />
                            )}
                            {mainText}
                        </Button>
                    </form>
                </div>
            </Modal>
        </>
    );
};

export default CreateWorkspaceModal;
