import TitleText from "@/components/TitleText";
import { Button } from "@/components/ui/button";
import LoadingCircle from "@/components/ui/LoadingCircle";
import Modal from "@/components/ui/Modal";
import type { ILink, ILinkState } from "@/redux/reducers/types";
import type { AppDispatch } from "@/redux/store";
import { deleteLink } from "@/redux/thunks/linksThunks";
import { IoIosLink } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";

const DeleteLinkModal = ({
    link,
    isOpen,
    onClose,
}: {
    link: ILink;
    isOpen: boolean;
    onClose: () => void;
}) => {
    const mainText = "Delete Link";
    const linkState: ILinkState = useSelector((state: any) => state.workspace);
    const dispatch = useDispatch<AppDispatch>();
    const handleDeleteBtn = () => {
        if (!link) return;
        dispatch(deleteLink(link._id)).then(() => onClose());
    };

    return (
        <>
            <Modal
                variant="outline"
                roundness="light"
                isOpen={isOpen}
                onClose={onClose}
            >
                <div className="flex items-center gap-2 mb-4">
                    <IoIosLink className="size-6" />
                    <TitleText className="text-xl">{mainText}</TitleText>
                </div>
                <div className="flex flex-col items-center gap-4">
                    <pre className="text-sm text-center text-muted-foreground">
                        {
                            "Are you sure you want to delete this link and all the data associated with it?\nThis action cannot be undone."
                        }
                    </pre>
                    <Button
                        className="flex gap-2 items-center w-fit"
                        variant="destructive"
                        onClick={handleDeleteBtn}
                    >
                        {linkState.deleteLoading && (
                            <LoadingCircle className="size-5" />
                        )}
                        <span>{mainText}</span>
                    </Button>
                </div>
            </Modal>
        </>
    );
};

export default DeleteLinkModal;
