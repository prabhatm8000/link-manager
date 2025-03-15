import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import Logo from "../../components/ui/Logo";
import useTheme from "../../hooks/useTheme";
import CtkToast from "../../components/CtkToast";
import Button from "../../components/ui/Button";
import { IoClose } from "react-icons/io5";

const AuthLayout = ({ children }: { children: ReactNode }) => {
    const { theme } = useTheme();
    return (
        <div className="h-screen overflow-hidden">
            <div className="fixed top-0 left-0 m-4">
                <Link to="/" className="w-fit">
                    <Logo className="" />
                </Link>
            </div>

            <div className="flex justify-center items-center w-full h-full">
                <div className="flex justify-center min-w-sm">{children}</div>
            </div>

            <div className="fixed -z-10 top-0 left-0 w-full h-full bg-white dark:bg-black">
                {theme === "dark" ? (
                    <img
                        src="/backgrounds/auth-dark.jpg"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <img
                        src="/backgrounds/auth-light.jpg"
                        className="w-full h-full object-cover"
                    />
                )}
            </div>
            <div className="fixed bottom-0 left-0 flex m-0 p-0 bg-black/5">
                <span>{"data as string"}</span>
                <Button className="text-purple-600">
                    <IoClose />
                </Button>
            </div>
        </div>
    );
};

export default AuthLayout;
