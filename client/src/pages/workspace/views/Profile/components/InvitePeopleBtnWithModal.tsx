import TitleText from "@/components/TitleText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingCircle from "@/components/ui/LoadingCircle";
import Modal from "@/components/ui/Modal";
import type { IWorkspaceState } from "@/redux/reducers/types";
import type { AppDispatch } from "@/redux/store";
import { sendInvite } from "@/redux/thunks/workspaceThunks";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BsSendPlus } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";

const InvitePeopleBtnWithModal = () => {
    const mainText = "Send Invite";
    const [showModal, setShowModal] = useState<boolean>(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const workspaceState: IWorkspaceState = useSelector(
        (state: any) => state.workspace
    );
    const dispatch = useDispatch<AppDispatch>();

    const handleCloseModal = () => {
        setShowModal(false);
    };
    const onSubmit = handleSubmit((data) => {
        dispatch(
            sendInvite({
                email: data.reciverEmail,
                workspaceId: workspaceState?.currentWorkspace?._id as string,
            })
        ).then(() => setShowModal(false));
    });

    return (
        <>
            <Button
                onClick={() => setShowModal(true)}
                variant="default"
                className="flex items-center justify-center gap-2"
            >
                <BsSendPlus className="size-5" />
                <span>Invite</span>
            </Button>
            <Modal
                className="max-w-sm"
                variant="outline"
                roundness="light"
                isOpen={showModal}
                onClose={handleCloseModal}
            >
                <div className="flex flex-col gap-8">
                    <TitleText className="text-xl">{mainText}</TitleText>
                    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                        <div className="flex flex-col gap-1 relative pb-4">
                            <Label htmlFor="reciverEmail">Email</Label>
                            <Input
                                id="reciverEmail"
                                type="email"
                                placeholder="Ex. jackson@example.com"
                                className="w-full"
                                maxLength={100}
                                {...register("reciverEmail", {
                                    required: "Receiver Email is required",
                                })}
                            />
                            {errors.reciverEmail && (
                                <span className="text-red-500 text-xs absolute bottom-0">
                                    {errors.reciverEmail.message as string}
                                </span>
                            )}
                        </div>

                        <Button
                            disabled={workspaceState?.loading}
                            type="submit"
                            className="my-2 flex gap-2 items-center justify-center"
                        >
                            {workspaceState?.loading && (
                                <LoadingCircle className="size-5" />
                            )}
                            <span>{mainText}</span>
                        </Button>
                    </form>
                </div>
            </Modal>
        </>
    );
};

export default InvitePeopleBtnWithModal;
