import { GoUnlink } from "react-icons/go";
import { IoIosLink, IoMdInformation } from "react-icons/io";
import { IoAlertSharp } from "react-icons/io5";

export const handleToastIcons = ({ type, theme }: { type: string; theme: string }) => {
    switch (type) {
        case "info":
            return <IoMdInformation className="stroke-indigo-400" />;
        case "error":
            return <GoUnlink className="stroke-red-500" />;
        case "success":
            return <IoIosLink className="stroke-green-500" />;
        case "warning":
            return <IoAlertSharp className="stroke-yellow-500" />;
        default:
            return null;
    }
};
