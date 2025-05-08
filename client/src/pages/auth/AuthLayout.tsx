import { Card } from "@/components/ui/Card";
import LoadingCircle from "@/components/ui/LoadingCircle";
import type { IUserState } from "@/redux/reducers/types";
import { type ReactNode } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Logo from "../../components/ui/Logo";
import useTheme from "../../hooks/useTheme";

const AuthLayout = ({ children }: { children: ReactNode }) => {
    const { theme } = useTheme();
    const userState: IUserState = useSelector((state: any) => state.user);

    return (
        <div className="h-dvh overflow-hidden">
            <div className="fixed top-0 left-0 m-4 z-20">
                <Link to="/" className="w-fit">
                    <Logo className="" />
                </Link>
            </div>

            <div className="relative flex justify-center items-center w-full h-full">
                {userState?.loading && (
                    <div className="absolute w-full h-full bg-background/40 z-10">
                        <LoadingCircle className="size-5 absolute translate-x-[-50%] translate-y-[-50%] top-1/2 left-1/2" />
                    </div>
                )}
                <Card className="max-w-96 w-full bg-transparent">
                    {children}
                </Card>
            </div>

            <div className="fixed -z-10 top-0 left-0 w-full h-full bg-white dark:bg-black">
                <img
                    src="/backgrounds/auth-dark.jpg"
                    className={`w-full h-full object-cover opacity-40 ${
                        theme === "dark" ? "" : "invert"
                    }`}
                />
            </div>
        </div>
    );
};

export default AuthLayout;
