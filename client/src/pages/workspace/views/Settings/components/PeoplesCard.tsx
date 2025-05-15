import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";
import LoadingCircle from "@/components/ui/LoadingCircle";
import type {
    IUser,
    IUserState,
    IWorkspace,
    IWorkspaceState,
} from "@/redux/reducers/types";
import { useSelector } from "react-redux";
import InvitePeopleBtnWithModal from "../../Profile/components/InvitePeopleBtnWithModal";
import PeopleItem from "../../Profile/components/PeopleItem";

const PeoplesCard = () => {
    const userState: IUserState = useSelector((state: any) => state.user);
    const workspaceState: IWorkspaceState = useSelector(
        (state: any) => state.workspace
    );
    const workspace = workspaceState.currentWorkspace as IWorkspace;
    return (
        <Card>
            <CardHeader>
                <CardTitle>People</CardTitle>
                <CardDescription className="flex justify-between items-end">
                    <span>Wanna invite someone?</span>
                    <div className="flex justify-between items-center gap-3">
                        {userState?.user?._id === workspace?.createdBy && (
                            <InvitePeopleBtnWithModal />
                        )}
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent>
                {workspaceState?.loading ? (
                    <LoadingCircle className="size-5" />
                ) : workspace.peopleDetails?.length ? (
                    <div className="flex flex-col gap-2">
                        {workspace.peopleDetails?.map(
                            (people: IUser, index) => (
                                <PeopleItem key={index} people={people} />
                            )
                        )}
                    </div>
                ) : (
                    <div className="text-muted-foreground">
                        huh!?, No people in the workspace!
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default PeoplesCard;
