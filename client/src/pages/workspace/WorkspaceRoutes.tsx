import { Route, Routes } from "react-router-dom";
import ErrorPage, { PageDataContants } from "../ErrorPage";
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
            <Route path="*" element={<ErrorPage pageData={PageDataContants.PageNotFound} />} />
        </Routes>
    );
};

export default WorkspaceRoutes;
