import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import Logo from "../../components/ui/Logo";
import { useTheme } from "../../hooks/useTheme";

const AuthLayout = ({ children }: { children: ReactNode }) => {
    const { theme } = useTheme();
    return (
        <div className="h-screen overflow-hidden">
            <div className="grid sm:grid-cols-[3fr_2fr] md:grid-cols-[1fr_1fr] lg:grid-cols-[1fr_2fr] 2xl:grid-cols-[1fr_3fr] h-full">
                <div className="h-full w-full grid grid-cols-1 items-center justify-center bg-white/60 dark:bg-black/60 backdrop-blur-sm">
                    <Link to="/" className="fixed top-0 left-0 m-4 ">
                        <Logo className="text-5xl" />
                    </Link>
                    {children}
                </div>
            </div>

            {/* <div className="fixed -z-10 top-0 left-0 sm:block w-full h-full">
                <img
                    src="/public/backgrounds/auth-light.jpg"
                    className={`w-full h-full object-cover dark:brightness-[0.50]`}
                />
            </div> */}
            <div className="fixed -z-10 top-0 left-0 w-full h-full">
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
