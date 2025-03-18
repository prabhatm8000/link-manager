import { lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
    useNavigate,
} from "react-router-dom";
import { ToastContainer, Zoom } from "react-toastify";
import SuspenseWrapper from "./components/SuspenseWrapper";
import ThemeBtn from "./components/ThemeBtn";
import useTheme from "./hooks/useTheme";
import { handleToastIcons } from "./lib/toastFuncs";
import LoadingPage from "./pages/LoadingPage";
import InvitePage from "./pages/invite/InvitePage";
import type { IUserState } from "./redux/reducers/types";
import type { AppDispatch } from "./redux/store";
import { verifyUser } from "./redux/thunks/usersThunk";
import { toast, Toaster } from "sonner";

const AuthRoutes = lazy(() => import("./pages/auth/AuthRoutes"));
const LandlingRoutes = lazy(() => import("./pages/landing/LandingRoutes"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const WorkspaceRoutes = lazy(() => import("./pages/workspace/WorkspaceRoutes"));

const PrivateRoutes = ({ user }: { user: IUserState }) => {
    const navigate = useNavigate();
    if (!user.isAuthenticated) {
        toast.error("You are not logged in.", {
            description: "Redirecting to login page.",
            onAutoClose: () => navigate("/auth/login"),
            position: "top-center",
        });
        return <LoadingPage />;
    }
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
                        user.loading ? (
                            <LoadingPage />
                        ) : (
                            <PrivateRoutes user={user} />
                        )
                    }
                />
                <Route
                    path="/invite/:workspaceId/:senderId/:token"
                    element={
                        user.loading ? (
                            <LoadingPage />
                        ) : (
                            <SuspenseWrapper>
                                <InvitePage />
                            </SuspenseWrapper>
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
            <ThemeBtn />
            <ToastContainer
                theme={theme}
                icon={handleToastIcons}
                draggable
                transition={Zoom}
                limit={5}
            />
            <Toaster theme={theme} richColors />
        </BrowserRouter>
    );
};

export default AppRouter;
