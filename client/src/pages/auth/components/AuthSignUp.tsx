import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import TitleText from "../../../components/TitleText";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import type { IUserState } from "../../../redux/reducers/types";
import type { AppDispatch } from "../../../redux/store";
import { registerAndSendOtp } from "../../../redux/thunks/usersThunk";

const AuthSignUp = () => {
    const {
        register,
        handleSubmit,
        getValues,
        watch,
        formState: { errors },
    } = useForm();

    const userState: IUserState = useSelector((state: any) => state.users);
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
        if (!userState?.error && !userState.loading && userState?.isOtpSent) {
            navigate("/auth/otp/" + getValues("email"));
        }
    }, [userState]);

    return (
        <Card variant="none" className="p-6 flex flex-col gap-4 w-full">
            <TitleText variant="none">Signup</TitleText>
            <form className="flex flex-col" onSubmit={onSubmit}>
                <Input
                    {...register("name", { required: "Name is required" })}
                    id="name"
                    type="text"
                    placeholder="Name"
                    variant={errors.name ? "danger-outline" : "outline"}
                    className="w-full"
                    autoComplete="name"
                />
                {errors.email && (
                    <p className="text-red-500 text-sm">
                        {errors.email.message as string}
                    </p>
                )}
                <Input
                    {...register("email", { required: "Email is required" })}
                    id="email"
                    type="email"
                    placeholder="Email"
                    variant={errors.name ? "danger-outline" : "outline"}
                    className="w-full"
                    autoComplete="email"
                />
                {errors.email && (
                    <p className="text-red-500 text-sm">
                        {errors.email.message as string}
                    </p>
                )}
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
                    variant={errors.name ? "danger-outline" : "outline"}
                    className="w-full"
                    autoComplete="new-password"
                />
                {errors.password && (
                    <p className="text-red-500 text-sm">
                        {errors.password.message as string}
                    </p>
                )}
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
                    variant={errors.name ? "danger-outline" : "outline"}
                    className="w-full"
                    autoComplete="new-password"
                />
                {errors.confirmPassword && (
                    <p className="text-red-500 text-sm">
                        {errors.confirmPassword.message as string}
                    </p>
                )}
                <Button
                    className="my-5"
                    type="submit"
                    disabled={userState.loading}
                >
                    Signup
                </Button>
            </form>
            <div className="text-center text-black/70 dark:text-white/70">
                already have an account?{" "}
                <Link to="/auth/login" className="text-blue-500">
                    Login
                </Link>
            </div>
        </Card>
    );
};

export default AuthSignUp;
