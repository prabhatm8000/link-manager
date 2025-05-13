import { IoIosLink } from "react-icons/io";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { IUserState } from "../redux/reducers/types";
import TitleText from "./TitleText";
import { Button } from "./ui/button";

const NavBar = () => {
    const user: IUserState = useSelector((state: any) => state.user);
    return (
        <nav className="sticky top-0 flex gap-2 items-end justify-between py-4 backdrop-blur-md z-50">
            <Link to={"/"} className="">
                <TitleText className="text-3xl flex gap-2 justify-start items-center">
                    <IoIosLink />
                    <span>Ref.com</span>
                </TitleText>
            </Link>
            <div className="flex gap-6 items-center justify-end">
                <Link to={"#home"}>Home</Link>
                <Link to={"#features"}>Features</Link>
                <Link to={"#pricing"}>Pricing</Link>
                <Link to={user?.isAuthenticated ? "/workspace" : "/auth/login"}>
                    <Button variant="default" className="px-4 py-2">
                        {user?.isAuthenticated ? "Workspace" : "Sign up"}
                    </Button>
                </Link>
            </div>
        </nav>
    );
};

export default NavBar;
