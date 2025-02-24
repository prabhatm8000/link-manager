import { IoClose } from "react-icons/io5";
import Button from "./Button";
import {
    getRoundnessClasses,
    getVariantClasses,
    type BasicElementProps,
} from "./classUtity";
import { useEffect } from "react";

interface IModalProps extends BasicElementProps {
    children: React.ReactNode;
    onClose: () => void;
    isOpen: boolean;
}

const Modal = (props: IModalProps) => {
    if (!props.isOpen) return null;
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.code === "Escape") {
                props.onClose();
            }
        };

        addEventListener("keydown", handleKey);

        return () => removeEventListener("keypress", handleKey);
    }, []);
    return (
        <div
            className={`fixed top-0 left-0 w-full h-full bg-black/50 z-50 flex justify-center items-center transition-all duration-300 ease-out `}
        >
            <div
                className={`relative min-w-96 bg-white p-4 rounded-lg transition duration-300 ${getVariantClasses(
                    props.variant
                )} ${getRoundnessClasses(props.roundness)} ${props.className}`}
            >
                <Button
                    onClick={props.onClose}
                    variant="danger"
                    className="absolute top-0 right-0 m-2"
                    style={{
                        padding: "4px",
                    }}
                >
                    <IoClose />
                </Button>
                {props.children}
            </div>
        </div>
    );
};

export default Modal;
