import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";
import Logo from "@/components/ui/Logo";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import TitleText from "../../components/TitleText";
import { Button } from "../../components/ui/button";
import LoadingCircle from "../../components/ui/LoadingCircle";
import useTheme from "../../hooks/useTheme";
import type {
    IUser,
    IUserState,
    IWorkspace,
    IWorkspaceState,
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
    const workspace: IWorkspaceState = useSelector(
        (state: any) => state.workspace
    );
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

    useEffect(() => {
        if (user?.loading === false && user?.isAuthenticated === false) {
            toast.error("You are not logged in.", {
                description: "Redirecting to login page.",
                onAutoClose: () => navigate("/auth/login"),
                position: "top-center",
            });
        }
    }, [user]);

    if (!inviteData) {
        return <LoadingPage />;
    }

    return (
        <div className="h-dvh overflow-hidden">
            <div className="fixed top-0 left-0 m-4 z-20">
                <Link to="/" className="w-fit">
                    <Logo className="" />
                </Link>
            </div>

            <div className="relative flex justify-center items-center w-full h-full xl:px-20">
                {workspace?.loading && (
                    <div className="absolute w-full h-full bg-background/40 z-10">
                        <LoadingCircle className="size-5 absolute translate-x-[-50%] translate-y-[-50%] top-1/2 left-1/2" />
                    </div>
                )}
                <Card className="max-w-82 lg:max-w-96 w-full bg-background/40 transform slide-in-from-bottom-16 transition-transform duration-300">
                    <CardHeader>
                        <CardTitle>
                            <TitleText className="text-center">
                                Workspace Invite
                            </TitleText>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-center flex flex-col gap-2">
                        <span>
                            You have been invited to join{" "}
                            <b>{inviteData?.workspace.name}</b> workspace by{" "}
                            <b>{inviteData?.senderDetails.name}</b>{" "}
                            {`(${inviteData?.senderDetails.email})`}.
                        </span>
                        <span>
                            Click on the button below to accept invite and join.
                        </span>
                    </CardContent>
                    <CardFooter>
                        <Button
                            onClick={handleAcceptInvite}
                            className="flex items-center justify-center gap-2 w-full"
                        >
                            <span>Accept Invite</span>
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <div className="fixed -z-10 top-0 left-0 w-full h-full bg-white dark:bg-black">
                <img
                    src="/backgrounds/auth.jpg"
                    className={`w-full h-full object-cover opacity-40 ${
                        theme === "dark" ? "" : "invert"
                    }`}
                />
            </div>
        </div>
    );
};

export default InvitePage;
