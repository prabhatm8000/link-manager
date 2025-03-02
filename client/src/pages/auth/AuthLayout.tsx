import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import Logo from "../../components/ui/Logo";
import useTheme from "../../hooks/useTheme";

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
                        src="/public/backgrounds/auth-dark.jpg"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <img
                        src="/public/backgrounds/auth-light.jpg"
                        className="w-full h-full object-cover"
                    />
                )}
            </div>
        </div>
    );
};

export default AuthLayout;
