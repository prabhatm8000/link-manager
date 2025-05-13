import TitleText from "@/components/TitleText";
import { Button } from "@/components/ui/button";
import {
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { IUserState } from "@/redux/reducers/types";
import type { AppDispatch } from "@/redux/store";
import { resetPassword } from "@/redux/thunks/usersThunk";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

const PasswordReset = () => {
    const userState: IUserState = useSelector((state: any) => state.user);
    const dispatch = useDispatch<AppDispatch>();
    const [searchParams, _] = useSearchParams();
    const email = searchParams.get("email");
    const token = searchParams.get("vt");
    const uid = searchParams.get("uid");
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<{ password: string; confirmPassword: string }>();
    const onSubmit = handleSubmit((data) => {
        if (!token || !uid) return;
        dispatch(
            resetPassword({
                uid: uid,
                pw: data.password,
                vt: token,
            })
        ).then(() => {
            setValue("password", "");
            setValue("confirmPassword", "");
        });
    });
    const isNotInValidForm = !email || !token || !uid;

    return (
        <>
            <CardHeader>
                <CardTitle>
                    <TitleText className="text-center">
                        {isNotInValidForm ? "Huh!?" : "Reset Password"}
                    </TitleText>
                </CardTitle>
                <div className="text-lg text-center font-semibold">
                    <h4>{isNotInValidForm ? "No email! nothing!?" : email}</h4>
                </div>
            </CardHeader>
            <CardContent className="px-4">
                <form className="flex flex-col gap-2" onSubmit={onSubmit}>
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
                        <span>Reset</span>
                    </Button>
                </form>
            </CardContent>
        </>
    );
};

export default PasswordReset;
