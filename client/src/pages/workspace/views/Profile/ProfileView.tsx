import type { IUserState, IWorkspaceState } from "@/redux/reducers/types";
import type { AppDispatch } from "@/redux/store";
import { getMyWorkspaces } from "@/redux/thunks/workspaceThunks";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProfileDetailCard from "./components/ProfileDetailCard";
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

                    {/* my workspaces */}
                    <WorkspacesTableCard />
                </div>
            </div>
        </>
    );
};

export default ProfileView;
