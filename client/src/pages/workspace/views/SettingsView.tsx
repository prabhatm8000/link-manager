import { useSelector } from "react-redux";
import Avatar from "../../../components/Avatar";
import LoadingCircle from "../../../components/ui/LoadingCircle";
import type {
    IUser,
    IUserState,
    IWorkspaceState,
} from "../../../redux/reducers/types";
import CreateWorkspaceBtnWithModal from "../components/CreateWorkspaceBtnWithModal";
import DeleteWorkspacebtnWithModal from "../components/DeleteWorkspacebtnWithModal";
import InviteTeamMemberBtnWithModal from "../components/InviteTeamMemberBtnWithModal";
import MemberItem from "../components/MemberItem";
import ViewHeader from "../components/ViewHeader";

const SettingsView = () => {
    const workspaceState: IWorkspaceState = useSelector(
        (state: any) => state.workspace
    );
    const userState: IUserState = useSelector((state: any) => state.user);
    if (!workspaceState?.currentWorkspace) return null;
    return (
        <>
            <ViewHeader
                heading="Settings"
                subHeading="Manage your workspace settings"
            />
            <div className="py-4 space-y-8">
                <div className="flex gap-3">
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
                            {`Created By: ${workspaceState?.currentWorkspace?.createdByDetails?.email}`}
                        </div>
                        <div className="text-black/50 dark:text-white/50">
                            {workspaceState?.currentWorkspace?.description}
                        </div>
                    </div>
                </div>

                {userState?.user?._id ===
                    workspaceState?.currentWorkspace?.createdBy && (
                    <div className="grid grid-cols-2 sm:flex justify-center sm:justify-end gap-3">
                        <CreateWorkspaceBtnWithModal
                            editMode
                            workspaceId={workspaceState?.currentWorkspace?._id}
                        />
                        <DeleteWorkspacebtnWithModal
                            workspaceId={workspaceState?.currentWorkspace?._id}
                        />
                    </div>
                )}

                <div className="flex justify-center flex-col sm:flex-row sm:justify-between gap-3">
                    <h3 className="text-black/50 dark:text-white/50">Team</h3>
                    {userState?.user?._id ===
                        workspaceState?.currentWorkspace?.createdBy && (
                        <InviteTeamMemberBtnWithModal />
                    )}
                </div>

                {workspaceState?.loading ? (
                    <LoadingCircle className="size-5" />
                ) : workspaceState?.currentWorkspace.teamDetails?.length ? (
                    <div>
                        {workspaceState?.currentWorkspace.teamDetails?.map(
                            (member: IUser, index) => (
                                <MemberItem key={index} member={member} />
                            )
                        )}
                    </div>
                ) : (
                    <div className="text-black/50 dark:text-white/50">
                        No team members
                    </div>
                )}
            </div>
        </>
    );
};

export default SettingsView;
