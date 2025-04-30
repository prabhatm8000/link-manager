import LoadingCircle from "@/components/ui/LoadingCircle";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type {
    IUser,
    IUserState,
    IWorkspaceState,
} from "@/redux/reducers/types";
import { useSelector } from "react-redux";
import InvitePeopleBtnWithModal from "../Profile/components/InvitePeopleBtnWithModal";
import PeopleItem from "../Profile/components/PeopleItem";
import DeleteWorkspaceCard from "./components/DeleteWorkspaceCard";
import WorkspaceDetailsCard from "./components/WorkspaceDetailsCard";

const SettingsView = () => {
    const workspaceState: IWorkspaceState = useSelector(
        (state: any) => state.workspace
    );
    const userState: IUserState = useSelector((state: any) => state.user);
    if (!workspaceState?.currentWorkspace) return null;
    return (
        <>
            <div className="py-4 space-y-8">
                <WorkspaceDetailsCard />
                <DeleteWorkspaceCard />

                <div className="flex justify-between items-center gap-3">
                    <h3 className="text-muted-foreground">People</h3>
                    {userState?.user?._id ===
                        workspaceState?.currentWorkspace?.createdBy && (
                        <InvitePeopleBtnWithModal />
                    )}
                </div>

                {workspaceState?.loading ? (
                    <LoadingCircle className="size-5" />
                ) : workspaceState?.currentWorkspace.peopleDetails?.length ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">
                                    Name
                                </TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {workspaceState?.currentWorkspace.peopleDetails?.map(
                                (people: IUser, index) => (
                                    <PeopleItem key={index} people={people} />
                                )
                            )}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-muted-foreground">
                        No people in this workspace
                    </div>
                )}
            </div>
        </>
    );
};

export default SettingsView;
