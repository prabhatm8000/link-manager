import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import TitleText from "../../../components/TitleText";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import type { IUserState } from "../../../redux/reducers/types";
import type { AppDispatch } from "../../../redux/store";
import { registerAndVerifyOtp } from "../../../redux/thunks/usersThunk";

import { useEffect, useState } from "react";

const AuthOtp = () => {
    const { register, handleSubmit } = useForm();
    const param = useParams();
    const userState: IUserState = useSelector((state: any) => state.users);
    const dispatch = useDispatch<AppDispatch>();
    const [timeLeft, setTimeLeft] = useState(5 * 60);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const onSubmit = handleSubmit((data) => {
        dispatch(
            registerAndVerifyOtp({
                email: param.email as string,
                otp: data.otp,
            })
        );
    });

    return (
        <Card variant="none" className="p-6 flex flex-col gap-4 w-full">
            <TitleText variant="none">Signup</TitleText>
            <form className="flex flex-col" onSubmit={onSubmit}>
                <p>OTP sent to {param.email}</p>
                <Input
                    {...register("otp", { required: true })}
                    id="otp"
                    type="text"
                    placeholder="OTP"
                    variant="outline"
                    className="w-full"
                    autoComplete="name"
                />
                <p>{`Time left: ${Math.floor(timeLeft / 60)}:${
                    timeLeft % 60
                }`}</p>
                <Button
                    className="my-5"
                    type="submit"
                    // disabled={userState.loading || timeLeft <= 0}
                >
                    Verify
                </Button>
            </form>
        </Card>
    );
};

export default AuthOtp;
