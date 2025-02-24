import { Route, Routes } from "react-router-dom";
import PageNotFound from "../PageNotFound";
import WorkspaceLayout from "./WorkspaceLayout";
import WorkspacePage from "./WorkspacePage";

const WorkspaceRoutes = () => {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <WorkspaceLayout>
                        <WorkspacePage />
                    </WorkspaceLayout>
                }
            />
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
};

export default WorkspaceRoutes;
