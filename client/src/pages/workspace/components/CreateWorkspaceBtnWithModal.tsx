import { useState } from "react";
import { useForm } from "react-hook-form";
import { IoIosAdd } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import TitleText from "../../../components/TitleText";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Modal from "../../../components/ui/Modal";
import type { IWorkspaceState } from "../../../redux/reducers/types";
import { AppDispatch } from "../../../redux/store";
import { createWorkspace } from "../../../redux/thunks/workspaceThunks";

const CreateWorkspaceBtnWithModal = () => {
    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] =
        useState<boolean>(false);
    const workspaceState: IWorkspaceState = useSelector(
        (state: any) => state.workspace
    );
    const dispatch = useDispatch<AppDispatch>();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = handleSubmit((data) => {
        dispatch(
            createWorkspace({
                name: data.workspaceName,
                description: data.workspaceDescription,
            })
        ).then(() => setShowCreateWorkspaceModal(false));
    });

    return (
        <>
            <Button
                onClick={() => setShowCreateWorkspaceModal(true)}
                variant="secondary"
                className="flex items-center gap-2"
            >
                <IoIosAdd />
                <span>Create workspace</span>
            </Button>
            <Modal
                variant="outline"
                roundness="light"
                isOpen={showCreateWorkspaceModal}
                onClose={() => setShowCreateWorkspaceModal(false)}
            >
                <div className="flex flex-col gap-2">
                    <TitleText className="text-xl">
                        Create Workspace
                    </TitleText>
                    <form className="flex flex-col gap-1" onSubmit={onSubmit}>
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
                            disabled={workspaceState.loading}
                            className="my-2"
                        >
                            Create Workspace
                        </Button>
                    </form>
                </div>
            </Modal>
        </>
    );
};

export default CreateWorkspaceBtnWithModal;
