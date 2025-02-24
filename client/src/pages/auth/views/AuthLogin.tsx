import { Link, useNavigate } from "react-router-dom";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import TitleText from "../../../components/TitleText";
import { useForm } from "react-hook-form";
import type { IUserState } from "../../../redux/reducers/types";
import { useSelector } from "react-redux";
import type { AppDispatch } from "../../../redux/store";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { login } from "../../../redux/thunks/usersThunk";
import LoadingCircle from "../../../components/ui/LoadingCircle";

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
            className="p-6 flex flex-col gap-4 w-full backdrop-blur-lg"
            variant="none"
        >
            <TitleText className="text-center">Login</TitleText>
            <form className="flex flex-col" onSubmit={onSubmit}>
                <Input
                    {...register("email", { required: true })}
                    id="email"
                    type="email"
                    placeholder="Email"
                    variant="outline"
                    className="w-full"
                    autoComplete="email"
                />
                {errors.email && (
                    <span className="text-red-500">
                        {errors.email.message as string}
                    </span>
                )}
                <Input
                    {...register("password", { required: true })}
                    id="password"
                    type="password"
                    placeholder="Password"
                    variant="outline"
                    className="w-full"
                    autoComplete="password"
                />
                {errors.password && (
                    <span className="text-red-500">
                        {errors.password.message as string}
                    </span>
                )}
                <Button
                    disabled={user?.loading}
                    type="submit"
                    className="mt-3 px-4 flex items-center justify-center gap-2"
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
