import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import TitleText from "../../../components/TitleText";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import type { IUserState } from "../../../redux/reducers/types";
import type { AppDispatch } from "../../../redux/store";
import { registerAndSendOtp } from "../../../redux/thunks/usersThunk";
import LoadingCircle from "../../../components/ui/LoadingCircle";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";

const AuthSignUp = () => {
    const {
        register,
        handleSubmit,
        getValues,
        watch,
        formState: { errors },
    } = useForm();

    const userState: IUserState = useSelector((state: any) => state.user);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const onSubmit = handleSubmit((data) => {
        dispatch(
            registerAndSendOtp({
                email: data.email,
                name: data.name,
                password: data.password,
            })
        );
    });

    useEffect(() => {
        if (!userState?.error && !userState?.loading && userState?.isOtpSent) {
            navigate("/auth/otp/" + getValues("email"));
        }
    }, [userState]);

    return (
        <Card className="min-w-80 max-w-sm w-full bg-transparent backdrop-blur-xs border-ring/80 ring-ring/50 ring-[3px]">
            <CardHeader>
                <CardTitle>
                    <TitleText className="text-center">Signup</TitleText>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                    <div className="flex flex-col gap-1 relative pb-4">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            {...register("name", {
                                required: "Name is required",
                            })}
                            id="name"
                            type="text"
                            placeholder="Name"
                            className="w-full"
                            autoComplete="name"
                        />
                        {errors.name && (
                            <span className="text-red-500 text-xs absolute bottom-0">
                                {errors.name.message as string}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1 relative pb-4">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            {...register("email", {
                                required: "Email is required",
                            })}
                            id="email"
                            type="email"
                            placeholder="Email"
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
                                required: "Password is required",
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                    message:
                                        "Password must be at least 8 characters, and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
                                },
                            })}
                            id="password"
                            type="password"
                            placeholder="Password"
                            className="w-full"
                            autoComplete="new-password"
                        />
                        {errors.password && (
                            <span className="text-red-500 text-xs absolute bottom-0">
                                {errors.password.message as string}
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-1 relative pb-4">
                        <Label htmlFor="confirmPassword">
                            Confirm Password
                        </Label>
                        <Input
                            {...register("confirmPassword", {
                                required: "Confirm Password is required",
                                validate: (value) => {
                                    if (value !== watch("password")) {
                                        return "Passwords do not match";
                                    }
                                },
                            })}
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm Password"
                            className="w-full"
                            autoComplete="new-password"
                        />
                        {errors.confirmPassword && (
                            <span className="text-red-500 text-xs absolute bottom-0">
                                {errors.confirmPassword.message as string}
                            </span>
                        )}
                    </div>

                    <Button
                        disabled={userState?.loading}
                        type="submit"
                        className="mt-2 px-4 flex items-center justify-center gap-2"
                    >
                        {userState?.loading && (
                            <LoadingCircle className="size-5" />
                        )}
                        <span>Signup</span>
                    </Button>
                </form>
            </CardContent>
            <CardFooter>
                <div className="text-center text-black/70 dark:text-white/70">
                    already have an account?{" "}
                    <Link to="/auth/login" className="text-blue-500">
                        Login
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
};

export default AuthSignUp;
