import { IoIosLink } from "react-icons/io";
import { Link } from "react-router-dom";
import TitleText from "./TitleText";
import { useSelector } from "react-redux";
import type { IUserState } from "../redux/reducers/types";
import { Button } from "./ui/button";

const NavBar = () => {
    const user: IUserState = useSelector((state: any) => state.user);
    return (
        <nav className="sticky top-0 flex gap-2 items-end justify-between p-4">
            <Link to={"/"} className="">
                <TitleText
                    className="text-3xl flex gap-2 justify-start items-center"
                >
                    <IoIosLink />
                    <span>Ref.com</span>
                </TitleText>
            </Link>
            <div className="flex gap-2 justify-end">
                <Link to={user?.isAuthenticated ? "/workspace" : "/auth/login"}>
                    <Button variant="default" className="px-4 py-2">
                        {user?.isAuthenticated ? "Go to Workspace" : "Sign up"}
                    </Button>
                </Link>
            </div>
        </nav>
    );
};

export default NavBar;
