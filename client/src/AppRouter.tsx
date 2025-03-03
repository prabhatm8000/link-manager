import { lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import SuspenseWrapper from "./components/SuspenseWrapper";
import ThemeBtn from "./components/ThemeBtn";
import useTheme from "./hooks/useTheme";
import { handleToastIcons } from "./lib/toastFuncs";
import LoadingPage from "./pages/LoadingPage";
import InvitePage from "./pages/invite/InvitePage";
import type { IUserState } from "./redux/reducers/types";
import type { AppDispatch } from "./redux/store";
import { verifyUser } from "./redux/thunks/usersThunk";

const AuthRoutes = lazy(() => import("./pages/auth/AuthRoutes"));
const LandlingRoutes = lazy(() => import("./pages/landing/LandingRoutes"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const WorkspaceRoutes = lazy(() => import("./pages/workspace/WorkspaceRoutes"));

const PrivateRoutes = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <SuspenseWrapper>
                        <WorkspaceRoutes />
                    </SuspenseWrapper>
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
    );
};

const AppRouter = () => {
    const user: IUserState = useSelector((state: any) => state.user);
    const dispatch = useDispatch<AppDispatch>();
    const { theme } = useTheme();

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
                        user.isAuthenticated ? (
                            <PrivateRoutes />
                        ) : user.loading ? (
                            <LoadingPage />
                        ) : (
                            // <Navigate to="/auth/login" />
                            <LoadingPage />
                            
                        )
                    }
                />
                <Route
                    path="/invite/:workspaceId/:senderId/:token"
                    element={
                        <SuspenseWrapper>
                            <InvitePage />
                        </SuspenseWrapper>
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
            <ThemeBtn />
            <ToastContainer theme={theme} icon={handleToastIcons} />
        </BrowserRouter>
    );
};

export default AppRouter;
