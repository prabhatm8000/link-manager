import type { IUserState, IWorkspaceState } from "@/redux/reducers/types";
import type { AppDispatch } from "@/redux/store";
import { getMyWorkspaces } from "@/redux/thunks/workspaceThunks";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfileDetailCard from "./components/ProfileDetailCard";
import ProfileEditCard from "./components/ProfileEditCard";
import WorkspacesTableCard from "./components/WorkspacesTableCard";

const ProfileView = () => {
    const userState: IUserState = useSelector((state: any) => state.user);
    const workspaceState: IWorkspaceState = useSelector(
        (state: any) => state.workspace
    );
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (workspaceState.myWorkspaces.length > 0) return;
        dispatch(getMyWorkspaces());
    }, []);

    if (!userState?.user) return null;
    return (
        <>
            <div className="flex flex-col gap-4 w-full">
                <div className="space-y-4">
                    <ProfileDetailCard />

                    <div className="grid grid-cols-1 md:grid-cols-[0.4fr_0.6fr] xl:grid-cols-[0.3fr_0.7fr] gap-4">
                        <ProfileEditCard />
                        <WorkspacesTableCard />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileView;
