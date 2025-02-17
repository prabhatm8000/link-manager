import { IoIosLink } from "react-icons/io";
import { Link } from "react-router-dom";
import Button from "./ui/Button";
import TitleText from "./TitleText";

const NavBar = () => {
    return (
        <nav className="sticky top-0 flex gap-2 items-end justify-between px-4 py-2">
            <Link to={"/dashboard"} className="">
                <TitleText variant="none" className="text-3xl flex gap-2 justify-start items-center">
                    <IoIosLink />
                    <span>Ref.com</span>
                </TitleText>
            </Link>
            <div className="flex gap-2 justify-end">
                <Link to="/auth/login">
                    <Button variant="primary" className="px-4 py-2">
                        Sign in
                    </Button>
                </Link>
            </div>
        </nav>
    );
};

export default NavBar;
