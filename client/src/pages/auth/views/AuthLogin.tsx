import { Link, useNavigate } from "react-router-dom";
import Card from "../../../components/ui/Card";
import TitleText from "../../../components/TitleText";
import { useForm } from "react-hook-form";
import type { IUserState } from "../../../redux/reducers/types";
import { useSelector } from "react-redux";
import type { AppDispatch } from "../../../redux/store";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { login } from "../../../redux/thunks/usersThunk";
import LoadingCircle from "../../../components/ui/LoadingCircle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

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
        <Card
            className="p-6 flex flex-col gap-8 w-full backdrop-blur-xs"
            variant="none"
        >
            <TitleText className="text-center">Login</TitleText>
            <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                <div className="flex flex-col gap-1 relative pb-4">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        {...register("email", {
                            required: "This field is required.",
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
                    className="mt-2 px-4 flex items-center justify-center gap-2"
                >
                    {user?.loading && <LoadingCircle className="size-5" />}
                    <span>Login</span>
                </Button>
            </form>
            <div className="text-center text-black/70 dark:text-white/70">
                don't have an account?{" "}
                <Link to="/auth/signup" className="text-blue-500">
                    Signup
                </Link>
            </div>
        </Card>
    );
};

export default AuthLogin;
