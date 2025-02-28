import { useSelector } from "react-redux";
import ViewHeader from "../components/ViewHeader";
import Avatar from "../../../components/Avatar";
import type { IWorkspaceState } from "../../../redux/reducers/types";
import CreateWorkspaceBtnWithModal from "../components/CreateWorkspaceBtnWithModal";
import DeleteWorkspacebtnWithModal from "../components/DeleteWorkspacebtnWithModal";

const SettingsView = () => {
    const workspaceState: IWorkspaceState = useSelector(
        (state: any) => state.workspace
    );
    if (!workspaceState?.currentWorkspace) return null;
    return (
        <>
            <ViewHeader
                heading="Settings"
                subHeading="Manage your workspace settings"
            />
            <div className="py-4 space-y-4">
                <div className="flex gap-2">
                    <Avatar
                        props={{
                            alt: workspaceState?.currentWorkspace?.name,
                        }}
                        size={"lg"}
                        title={workspaceState?.currentWorkspace?.name || "W"}
                    />
                    <div className="">
                        <h3 className="text-xl line-clamp-1">
                            {workspaceState?.currentWorkspace?.name}
                        </h3>
                        <div className="text-black/50 dark:text-white/50">
                            {workspaceState?.currentWorkspace?.description}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-4">
                    <CreateWorkspaceBtnWithModal
                        editMode
                        workspaceId={workspaceState?.currentWorkspace?._id}
                    />
                    <DeleteWorkspacebtnWithModal
                        workspaceId={workspaceState?.currentWorkspace?._id}
                    />
                </div>


            </div>
        </>
    );
};

export default SettingsView;
