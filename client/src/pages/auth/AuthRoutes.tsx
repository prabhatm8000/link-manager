import { Route, Routes } from "react-router-dom";
import PageNotFound from "../PageNotFound";
import AuthLogin from "./views/AuthLogin";
import AuthSignUp from "./views/AuthSignUp";
import AuthLayout from "./AuthLayout";
import AuthOtp from "./views/AuthOtp";

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
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
};

export default AuthRoutes;
