import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import TitleText from "../../../components/TitleText";
import { Button } from "../../../components/ui/button";
import Card from "../../../components/ui/Card";
import { Input } from "../../../components/ui/input";
import type { IUserState } from "../../../redux/reducers/types";
import type { AppDispatch } from "../../../redux/store";
import {
    registerAndVerifyOtp,
    resendOtp,
} from "../../../redux/thunks/usersThunk";

import { useEffect, useState } from "react";
import LoadingCircle from "../../../components/ui/LoadingCircle";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";

const coolDownTime = 2.5 * 60;
const AuthOtp = () => {
    const { register, handleSubmit } = useForm();
    const param = useParams();
    const userState: IUserState = useSelector((state: any) => state.user);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [coolDownTimer, setCoolDownTimer] = useState(coolDownTime);

    useEffect(() => {
        if (coolDownTimer <= 0) return;
        const timer = setInterval(() => {
            setCoolDownTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [coolDownTimer]);

    const onSubmit = handleSubmit((data) => {
        dispatch(
            registerAndVerifyOtp({
                email: param.email as string,
                otp: data.otp,
            })
        );
    });

    const handleResendOtp = () => {
        dispatch(resendOtp()).then(() => {
            setCoolDownTimer(coolDownTime);
        });
    };

    useEffect(() => {
        if (userState.isAuthenticated) {
            navigate("/workspace");
        }
    }, [userState.isAuthenticated]);

    return (
        <Card
            variant="none"
            className="p-6 flex flex-col gap-8 w-full backdrop-blur-xs"
        >
            <TitleText className="text-center">Signup</TitleText>
            <form className="flex flex-col gap-6" onSubmit={onSubmit}>
                <p className="text-center">OTP sent to {param.email}</p>
                <Input
                    {...register("otp", { required: true })}
                    id="otp"
                    type="text"
                    placeholder="OTP"
                    className="w-full"
                    autoComplete="name"
                />
                <div className="flex justify-center items-center gap-2">
                    <span>
                        {`${Math.floor(coolDownTimer / 60)}:${(
                            coolDownTimer % 60
                        )
                            .toString()
                            .padStart(2, "0")}`}
                    </span>
                    <Button
                        disabled={userState?.loading || coolDownTimer > 0}
                        type="button"
                        variant="link"
                        onClick={handleResendOtp}
                        className={
                            !(userState?.loading || coolDownTimer > 0)
                                ? "hover:underline"
                                : ""
                        }
                    >
                        resend
                    </Button>
                </div>

                <Button
                    disabled={userState?.loading}
                    type="submit"
                    className="mt-2 px-4 flex items-center justify-center gap-2"
                >
                    {userState?.loading && <LoadingCircle className="size-5" />}
                    <span>Verify</span>
                </Button>
            </form>
        </Card>
    );
};

export default AuthOtp;
