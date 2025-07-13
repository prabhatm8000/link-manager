import { motion } from "framer-motion";
import { useState } from "react";
import { IoIosClose, IoIosLink } from "react-icons/io";
import { TbMenu } from "react-icons/tb";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { IUserState } from "../redux/reducers/types";
import TitleText from "./TitleText";
import { Button } from "./ui/button";

const NavBar = () => {
    const user: IUserState = useSelector((state: any) => state.user);
    const [showNavItems, setShowNavItems] = useState(false);

    const links = (
        <>
            <a href={"#home"}>Home</a>
            <a href={"#features"}>Features</a>
            <a href={"#pricing"}>Pricing</a>
            <a href={user?.isAuthenticated ? "/workspace" : "/auth/login"}>
                <Button variant="default" className="px-4 py-2">
                    {user?.isAuthenticated ? "Workspace" : "Sign up"}
                </Button>
            </a>
        </>
    );
    return (
        <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1, ease: "easeInOut" }}
            className={`fixed w-full top-0 p-6 z-50 ${
                showNavItems ? "h-screen gap-6" : "h-auto"
            }`}
        >
            <div className="max-w-7xl mx-auto flex flex-col bg-muted-foreground/20 backdrop-blur-xs rounded-2xl border border-muted-foreground/20">
                <div className={`flex gap-2 items-end justify-between p-4`}>
                    <Link to={"/"} className="">
                        <TitleText className="text-3xl flex gap-2 justify-start items-center">
                            <IoIosLink />
                            <span>Ref.com</span>
                        </TitleText>
                    </Link>

                    <div className="hidden md:flex gap-6 items-center justify-end">
                        {links}
                    </div>

                    <Button
                        variant={"outline"}
                        className="md:hidden transition-all duration-300 ease-out z-50"
                        onClick={() => setShowNavItems((p) => !p)}
                        size={"icon"}
                    >
                        <div
                            className={`transform ${
                                showNavItems ? "rotate-0" : "rotate-360"
                            } transition-all duration-500 ease-in-out`}
                        >
                            {showNavItems ? (
                                <IoIosClose className="size-8" />
                            ) : (
                                <TbMenu className="size-5" />
                            )}
                        </div>
                    </Button>
                </div>
                <div className="left-0 flex flex-col mt-6 gap-6 w-full md:hidden text-xl">
                    {showNavItems && links}
                </div>
            </div>
        </motion.nav>
    );
};

export default NavBar;
