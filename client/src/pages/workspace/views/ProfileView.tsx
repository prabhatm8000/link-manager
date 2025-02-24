import { useSelector } from "react-redux";
import LogoutBtn from "../../../components/LogoutBtn";
import type { IUserState } from "../../../redux/reducers/types";
import ViewHeader from "../components/ViewHeader";

const ProfileView = () => {
    const userState: IUserState = useSelector((state: any) => state.user);
    if (!userState.user) return null;
    return (
        <>
            <ViewHeader heading="Profile" subHeading="Manage your profile" />
            <div className="flex flex-col gap-4 px-2 pt-6 pb-10">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-bold">Name:</span>
                    <span className="text-sm">{userState.user.name}</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-bold">Email:</span>
                    <span className="text-sm">{userState.user.email}</span>
                </div>
            </div>
            <LogoutBtn variant="danger" />
        </>
    );
};

export default ProfileView;
