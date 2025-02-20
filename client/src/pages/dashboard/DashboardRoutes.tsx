import { Route, Routes } from "react-router-dom";
import PageNotFound from "../PageNotFound";

const DashboardRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<div>Dashboard</div>} />
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
};

export default DashboardRoutes;
