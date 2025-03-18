import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import NavBar from "../../components/NavBar";
import TitleText from "../../components/TitleText";
import { Button } from "../../components/ui/button";
import LoadingCircle from "../../components/ui/LoadingCircle";
import useTheme from "../../hooks/useTheme";
import type {
    IUser,
    IUserState,
    IWorkspace,
    IWorkspaceState
} from "../../redux/reducers/types";
import { AppDispatch } from "../../redux/store";
import {
    getAcceptInvite,
    postAcceptInvite,
} from "../../redux/thunks/workspaceThunks";
import LoadingPage from "../LoadingPage";

const InvitePage = () => {
    const { theme } = useTheme();
    const { senderId, workspaceId, token } = useParams<{
        senderId: string;
        workspaceId: string;
        token: string;
    }>();
    const [inviteData, setInviteData] = useState<{
        workspace: IWorkspace;
        senderDetails: IUser;
    }>();
    const workspace: IWorkspaceState = useSelector((state: any) => state.workspace);
    const user: IUserState = useSelector((state: any) => state.user.user);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const getAcceptInviteCall = async () => {
        const resultAction = await dispatch(
            getAcceptInvite({
                workspaceId: workspaceId as string,
                senderId: senderId as string,
                token: token as string,
            })
        );
        if (getAcceptInvite.fulfilled.match(resultAction)) {
            setInviteData(resultAction.payload.data);
        }
    };

    const handleAcceptInvite = () => {
        dispatch(
            postAcceptInvite({
                workspaceId: workspaceId as string,
                senderId: senderId as string,
                token: token as string,
            })
        ).then(() => {
            navigate(`/workspace`);
        });
    };

    useEffect(() => {
        getAcceptInviteCall();
    }, []);

    if (!user?.isAuthenticated) {
        toast.error("You are not logged in.", {
            description: "Redirecting to login page.",
            onAutoClose: () => navigate("/auth/login"),
            position: "top-center",
        });
    }

    if (!inviteData) {
        return <LoadingPage />;
    }

    return (
        <>
            <NavBar />
            <div className="min-w-sm md:max-w-xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl w-full h-full p-4 py-20 m-auto flex flex-col sm:items-center gap-10 sm:text-center">
                <TitleText className="text-5xl font-bold">
                    Workspace Invite
                </TitleText>

                <div className="flex flex-col gap-2 text-black/70 dark:text-white/70">
                    <span>
                        You have been invited to join{" "}
                        <b>{inviteData?.workspace.name}</b> workspace by{" "}
                        <b>{inviteData?.senderDetails.name}</b>{" "}
                        {`(${inviteData?.senderDetails.email})`}.
                    </span>
                    <span>Click on the button below to join.</span>
                </div>

                <div className="w-full sm:w-fit">
                    <Button
                        onClick={handleAcceptInvite}
                        className="px-4 flex items-center justify-center gap-2 w-full"
                    >
                        {workspace.loading && <LoadingCircle />}
                        <span>Accept Invite</span>
                    </Button>
                </div>
            </div>

            <div className="fixed -z-10 top-0 left-0 w-full h-full bg-white dark:bg-black">
                {theme === "dark" ? (
                    <img
                        src="/backgrounds/auth-dark.jpg"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <img
                        src="/backgrounds/auth-light.jpg"
                        className="w-full h-full object-cover"
                    />
                )}
            </div>
        </>
    );
};

export default InvitePage;
