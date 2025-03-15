import { IoClose } from "react-icons/io5";
import type { ToastContentProps } from "react-toastify";
import Button from "./ui/Button";

const CtkToast = ({ closeToast, data, toastProps }: ToastContentProps) => {
    return (
        <div className="w-full h-full flex items-center bg-red-500">
            <div className="flex justify-between w-full px-4 bg-purple-400">
                <span>{toastProps?. as string}</span>
                <Button
                    onClick={() => closeToast(true)}
                    className="bg-purple-600 text-xs"
                >
                    <IoClose />
                </Button>
            </div>
        </div>
    );
};

export default CtkToast;
