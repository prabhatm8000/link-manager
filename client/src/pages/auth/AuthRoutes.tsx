import type { IUserState } from "@/redux/reducers/types";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import ErrorPage, { PageDataContants } from "../ErrorPage";
import AuthLayout from "./AuthLayout";
import AuthLogin from "./views/AuthLogin";
import AuthSignUp from "./views/AuthSignUp";
import PasswordReset from "./views/PasswordReset";
import VerifyEmail from "./views/VerifyEmail";

const AuthRoutes = () => {
    const userState: IUserState = useSelector((state: any) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (userState?.isAuthenticated) {
            navigate("/workspace");
        }
    }, [userState?.isAuthenticated]);
    
    return (
        <Routes>
            <Route
                path="login"
                element={
                    <AuthLayout>
                        <AuthLogin />
                    </AuthLayout>
                }
            />
            <Route
                path="signup"
                element={
                    <AuthLayout>
                        <AuthSignUp />
                    </AuthLayout>
                }
            />
            <Route
                path="emailverify"
                element={
                    <AuthLayout>
                        <VerifyEmail />
                    </AuthLayout>
                }
            />
            <Route
                path="passwordreset"
                element={
                    <AuthLayout>
                        <PasswordReset />
                    </AuthLayout>
                }
            />
            <Route
                path="*"
                element={<ErrorPage pageData={PageDataContants.PageNotFound} />}
            />
        </Routes>
    );
};

export default AuthRoutes;
