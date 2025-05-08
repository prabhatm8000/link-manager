import { lazy, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import SuspenseWrapper from "./components/SuspenseWrapper";
import ThemeBtn from "./components/ThemeBtn";
import useTheme from "./hooks/useTheme";
import { PageDataContants } from "./pages/ErrorPage";
import LinkPassword from "./pages/LinkPassword";
import LoadingPage from "./pages/LoadingPage";
import InvitePage from "./pages/invite/InvitePage";
import type { IUserState } from "./redux/reducers/types";
import type { AppDispatch } from "./redux/store";
import { verifyUser } from "./redux/thunks/usersThunk";

const AuthRoutes = lazy(() => import("./pages/auth/AuthRoutes"));
const LandlingRoutes = lazy(() => import("./pages/landing/LandingRoutes"));
const ErrorPage = lazy(() => import("./pages/ErrorPage"));
const WorkspaceRoutes = lazy(() => import("./pages/workspace/WorkspaceRoutes"));

const PrivateRoutes = ({ user }: { user: IUserState }) => {
    const navigate = useNavigate();
    if (!user.isAuthenticated) {
        toast.error("You are not logged in.", {
            description: "Redirecting to login page.",
            onAutoClose: () => navigate("/auth/login"),
            position: "top-center",
            duration: 5000,
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
                        <ErrorPage pageData={PageDataContants.PageNotFound} />
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
                    // will have url query params
                    path="/error-page"
                    element={
                        <SuspenseWrapper>
                            <ErrorPage />
                        </SuspenseWrapper>
                    }
                />
                <Route
                    // for - if link is password protected
                    path="/link-password"
                    element={
                        <SuspenseWrapper>
                            <LinkPassword />
                        </SuspenseWrapper>
                    }
                />
                <Route
                    path="*"
                    element={
                        <SuspenseWrapper>
                            <ErrorPage
                                pageData={PageDataContants.PageNotFound}
                            />
                        </SuspenseWrapper>
                    }
                />
            </Routes>
            <ThemeBtn />
            <Toaster
                theme={theme}
                richColors
                duration={5 * 1000}
                swipeDirections={["bottom", "left", "right", "top"]}
                closeButton
            />
        </BrowserRouter>
    );
};

export default AppRouter;
