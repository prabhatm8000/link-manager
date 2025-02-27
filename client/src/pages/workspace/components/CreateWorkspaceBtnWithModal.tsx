import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoIosAdd } from "react-icons/io";
import { TbEdit } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import TitleText from "../../../components/TitleText";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Modal from "../../../components/ui/Modal";
import type {
    IWorkspace,
    IWorkspaceState,
} from "../../../redux/reducers/types";
import { AppDispatch } from "../../../redux/store";
import {
    createWorkspace,
    updateWorkspace,
} from "../../../redux/thunks/workspaceThunks";
import LoadingCircle from "../../../components/ui/LoadingCircle";

/**
 * workspaceId is used for edit mode, should be passed as a prop
 */
const CreateWorkspaceBtnWithModal = ({
    editMode,
    dontShowBtnText,
    workspaceId,
}: {
    editMode?: boolean;
    dontShowBtnText?: boolean;
    workspaceId?: string;
}) => {
    const mainText = editMode ? "Edit workspace" : "Create workspace";
    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] =
        useState<boolean>(false);
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
            ).then(() => setShowCreateWorkspaceModal(false));
        } else {
            dispatch(
                createWorkspace({
                    name: workspaceName,
                    description: workspaceDescription,
                })
            ).then(() => setShowCreateWorkspaceModal(false));
        }
    });

    const handleCloseModal = () => {
        setShowCreateWorkspaceModal(false);
        setValue("workspaceName", workspace?.name || "");
        setValue("workspaceDescription", workspace?.description || "");
    };

    // edit mode: setting current workspace name and description
    useEffect(() => {
        if (!workspace && workspaceId && workspaceState.myWorkspaces.length) {
            const workspace = workspaceState.myWorkspaces.find(
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
            <Button
                onClick={() => setShowCreateWorkspaceModal(true)}
                variant="secondary"
                className="flex items-center gap-2"
            >
                {editMode ? <TbEdit /> : <IoIosAdd />}
                {!dontShowBtnText && <span>{mainText}</span>}
            </Button>
            <Modal
                variant="outline"
                roundness="light"
                isOpen={showCreateWorkspaceModal}
                onClose={handleCloseModal}
            >
                <div className="flex flex-col gap-2">
                    <TitleText className="text-xl">{mainText}</TitleText>
                    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                        <Input
                            id="workspaceName"
                            type="text"
                            placeholder="Workspace Name"
                            variant="outline"
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
                            <span className="text-red-500">
                                {errors.workspaceName.message as string}
                            </span>
                        )}
                        <Input
                            id="workspaceDescription"
                            type="text"
                            placeholder="Workspace Description"
                            variant="outline"
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
                            <span className="text-red-500">
                                {errors.workspaceName.message as string}
                            </span>
                        )}
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

export default CreateWorkspaceBtnWithModal;
