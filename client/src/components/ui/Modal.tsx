import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import {
    getRoundnessClasses,
    getVariantClasses,
    type BasicElementProps,
} from "./classUtity";
import { Button } from "./button";

interface IModalProps extends BasicElementProps {
    children: React.ReactNode;
    onClose: () => void;
    isOpen: boolean;
}

const Modal = ({ isOpen, ...props }: IModalProps) => {
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.code === "Escape") {
                props.onClose();
            }
        };

        window.addEventListener("keydown", handleKey);

        return () => {
            window.removeEventListener("keydown", handleKey);
        };
    }, [props.onClose]);

    // if (!isOpen) return null;
    return (
        <div
            className={`fixed top-0 left-0 w-full h-full backdrop-blur-[2px] bg-black/50 z-50 flex justify-center items-center transition-all duration-300 ease-out ${
                isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={props.onClose}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={`relative min-w-96 bg-white p-4 rounded-lg max-h-[calc(100vh-4rem)] overflow-auto ${getVariantClasses(
                    props.variant
                )} ${getRoundnessClasses(props.roundness)} ${props.className}`}
            >
                <Button
                    onClick={props.onClose}
                    variant="destructive"
                    size={"icon"}
                    className="absolute top-0 right-0 m-2"
                >
                    <IoClose className="size-5" />
                </Button>
                {props.children}
            </div>
        </div>
    );
};

export default Modal;
