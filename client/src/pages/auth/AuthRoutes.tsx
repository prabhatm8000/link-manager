import { Route, Routes } from "react-router-dom";
import ErrorPage, { PageDataContants } from "../ErrorPage";
import AuthLayout from "./AuthLayout";
import AuthLogin from "./views/AuthLogin";
import AuthOtp from "./views/AuthOtp";
import AuthSignUp from "./views/AuthSignUp";

const AuthRoutes = () => {
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
                path="otp/:email"
                element={
                    <AuthLayout>
                        <AuthOtp />
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
