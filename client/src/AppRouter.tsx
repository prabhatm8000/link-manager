import { lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SuspenseWrapper from "./components/SuspenseWrapper";

const AuthRoutes = lazy(() => import("./pages/auth/AuthRoutes"));
const LandlingRoutes = lazy(() => import("./pages/landing/LandingRoutes"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));

const AppRouter = () => {
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
                    path="/dashboard"
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
