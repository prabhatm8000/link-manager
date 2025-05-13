import { useSearchParams } from "react-router-dom";
import TitleText from "../../../components/TitleText";
import { Button } from "../../../components/ui/button";

import { CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import type { IUserState } from "@/redux/reducers/types";
import { AppDispatch } from "@/redux/store";
import { cancelVerification, verifyUserEmail } from "@/redux/thunks/usersThunk";
import { useDispatch, useSelector } from "react-redux";

const VerifyEmail = () => {
    const userState: IUserState = useSelector((state: any) => state.user);
    const [searchParams, _] = useSearchParams();
    const email = searchParams.get("email");
    const uid = searchParams.get("uid");
    const vt = searchParams.get("vt");

    const dispatch = useDispatch<AppDispatch>();
    const handleVerifyEmail = () => {
        if (!uid || !vt) {
            return;
        }
        dispatch(verifyUserEmail({ uid: uid.toString(), vt: vt.toString() }));
    };
    const handleCancelAndDelete = () => {
        if (!uid || !vt) {
            return;
        }
        dispatch(
            cancelVerification({ uid: uid.toString(), vt: vt.toString() })
        )
    };

    const isNotInValidForm = !uid || !vt || !email;
    return (
        <>
            <CardHeader>
                <CardTitle>
                    <TitleText className="text-center">
                        {isNotInValidForm ? "Huh!?" : "Verifying Email"}
                    </TitleText>
                </CardTitle>
                <div className="text-lg text-center font-semibold">
                    <h4>{isNotInValidForm ? "No email! nothing!?" : email}</h4>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-6">
                <div className="text-muted-foreground text-center text-sm">
                    {isNotInValidForm
                        ? "The heck, you call that a vaild verfication link!? Where are the query params?"
                        : `An attempt was made to create an account on Ref.com. Verify
                    your email by clicking the verify email link, ignoring this
                    email if you did not create an account.`}
                </div>
                <Button
                    disabled={isNotInValidForm || userState.loading}
                    onClick={handleVerifyEmail}
                    className="w-full"
                >
                    Verify Email
                </Button>
                <Button
                    disabled={isNotInValidForm || userState.loading}
                    onClick={handleCancelAndDelete}
                    className="w-full"
                    variant="destructive"
                >
                    Cancel & Delete Account
                </Button>
            </CardContent>
        </>
    );
};

export default VerifyEmail;
