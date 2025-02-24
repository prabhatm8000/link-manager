import { IoIosLogOut } from "react-icons/io";
import Button, { type ButtonProps } from "./ui/Button";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { logout } from "../redux/thunks/usersThunk";

const LogoutBtn = (props: ButtonProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const handleLogout = () => {
        dispatch(logout()).then(() => {
            window.location.href = "/";
        });
    };
    return (
        <Button
            className="flex items-center gap-2"
            onClick={handleLogout}
            {...props}
        >
            <IoIosLogOut />
            <span>Logout</span>
        </Button>
    );
};

export default LogoutBtn;
