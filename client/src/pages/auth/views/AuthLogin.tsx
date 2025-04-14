import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import TitleText from "../../../components/TitleText";
import type { IUserState } from "../../../redux/reducers/types";
import type { AppDispatch } from "../../../redux/store";
import { login } from "../../../redux/thunks/usersThunk";
import GoogleLoginBtn from "../components/GoogleLoginBtn";

const AuthLogin = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const user: IUserState = useSelector((state: any) => state.user);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.isAuthenticated) {
            navigate("/workspace");
        }
    }, [user]);

    const onSubmit = handleSubmit((data) => {
        dispatch(
            login({
                email: data.email,
                password: data.password,
            })
        );
    });

    return (
        <>
            <CardHeader>
                <CardTitle>
                    <TitleText className="text-center">Login</TitleText>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                    <div className="flex flex-col gap-1 relative pb-4">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            {...register("email", {
                                required: "This field is required.",
                            })}
                            id="email"
                            type="email"
                            placeholder="Your email address"
                            className="w-full"
                            autoComplete="email"
                        />
                        {errors.email && (
                            <span className="text-red-500 text-xs absolute bottom-0">
                                {errors.email.message as string}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1 relative pb-4">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            {...register("password", {
                                required: "This field is required.",
                            })}
                            id="password"
                            type="password"
                            placeholder="Password"
                            className="w-full"
                            autoComplete="password"
                        />
                        {errors.password && (
                            <span className="text-red-500 text-xs absolute bottom-0">
                                {errors.password.message as string}
                            </span>
                        )}
                    </div>
                    <Button
                        disabled={user?.loading}
                        type="submit"
                        className="mt-2 px-4 flex items-center justify-center gap-1"
                    >
                        <span>Login</span>
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex-col gap-4">
                <div className="w-full text-center text-black/70 dark:text-white/70">
                    don't have an account?{" "}
                    <Link to="/auth/signup" className="text-blue-500">
                        Signup
                    </Link>
                </div>
                <div className="flex w-full gap-1 items-center text-muted-foreground">
                    <span className="pt-0.5 mt-1 w-full bg-muted-foreground/60" />
                    <span>or</span>
                    <span className="pt-0.5 mt-1 w-full bg-muted-foreground/60" />
                </div>
                <GoogleLoginBtn />
            </CardFooter>
        </>
    );
};

export default AuthLogin;
