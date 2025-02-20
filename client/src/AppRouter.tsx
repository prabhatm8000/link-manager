import { lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SuspenseWrapper from "./components/SuspenseWrapper";
import DashboardRoutes from "./pages/dashboard/DashboardRoutes";
import LoadingPage from "./pages/LoadingPage";
import type { IUserState } from "./redux/reducers/types";
import type { AppDispatch } from "./redux/store";
import { verifyUser } from "./redux/thunks/usersThunk";

const AuthRoutes = lazy(() => import("./pages/auth/AuthRoutes"));
const LandlingRoutes = lazy(() => import("./pages/landing/LandingRoutes"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

const PrivateRoutes = () => {
    const user: IUserState = useSelector((state: any) => state.user);
    return (
        <Routes>
            {user?.isAuthenticated && (
                <Route
                    path="/"
                    element={
                        <SuspenseWrapper>
                            <DashboardRoutes />
                        </SuspenseWrapper>
                    }
                />
            )}
            <Route
                path="*"
                element={
                    <SuspenseWrapper>
                        {user?.loading ? <LoadingPage /> : <PageNotFound />}
                    </SuspenseWrapper>
                }
            />
        </Routes>
    );
};

const AppRouter = () => {
    const user: IUserState = useSelector((state: any) => state.user);
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        dispatch(verifyUser());
    }, []);
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <SuspenseWrapper>
                            <LandlingRoutes />
                        </SuspenseWrapper>
                    }
                />
                <Route
                    path="/auth/*"
                    element={
                        <SuspenseWrapper>
                            <AuthRoutes />
                        </SuspenseWrapper>
                    }
                />
                <Route
                    path="/workspace/*"
                    element={
                        user?.isAuthenticated ? (
                            <PrivateRoutes />
                        ) : (
                            <AuthRoutes />
                        )
                    }
                />
                <Route
                    path="*"
                    element={
                        <SuspenseWrapper>
                            <PageNotFound />
                        </SuspenseWrapper>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;
