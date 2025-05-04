import type { IWorkspaceState } from "@/redux/reducers/types";
import { useSelector } from "react-redux";
import DeleteWorkspaceCard from "./components/DeleteWorkspaceCard";
import PeoplesTableCard from "./components/PeoplesTableCard";
import WorkspaceDetailsCard from "./components/WorkspaceDetailsCard";

const SettingsView = () => {
    const workspaceState: IWorkspaceState = useSelector(
        (state: any) => state.workspace
    );
    if (!workspaceState?.currentWorkspace) return null;
    return (
        <>
            <div className="pb-4 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-[0.4fr_0.6fr] gap-4">
                <WorkspaceDetailsCard />
                <PeoplesTableCard />
                <DeleteWorkspaceCard />
            </div>
        </>
    );
};

export default SettingsView;
