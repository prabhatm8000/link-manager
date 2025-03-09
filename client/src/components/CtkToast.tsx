import { IoClose } from "react-icons/io5";
import type { ToastContentProps } from "react-toastify";
import Button from "./ui/Button";

const CtkToast = ({ closeToast, data }: ToastContentProps) => {
    return (
        <div className="flex m-0 p-0">
            <span>{data as string}</span>
            <Button
                onClick={() => closeToast("reply")}
                className="text-purple-600"
            >
                <IoClose />
            </Button>
        </div>
    );
};

export default CtkToast;
