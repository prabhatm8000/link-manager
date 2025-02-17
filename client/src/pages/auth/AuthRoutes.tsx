import { Route, Routes } from "react-router-dom";
import PageNotFound from "../PageNotFound";
import AuthLogin from "./components/AuthLogin";
import AuthSignUp from "./components/AuthSignUp";
import AuthLayout from "./AuthLayout";

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
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
};

export default AuthRoutes;
