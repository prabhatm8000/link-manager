import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import LoadingCircle from "@/components/ui/LoadingCircle";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { IUser, IUserState, IWorkspace, IWorkspaceState } from "@/redux/reducers/types";
import { useSelector } from "react-redux";
import InvitePeopleBtnWithModal from "../../Profile/components/InvitePeopleBtnWithModal";
import PeopleItem from "../../Profile/components/PeopleItem";

const PeoplesTableCard = () => {
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
                        {userState?.user?._id ===
                            workspace?.createdBy && (
                            <InvitePeopleBtnWithModal />
                        )}
                    </div>
                </CardDescription>
            </CardHeader>
            <CardContent>
                {workspaceState?.loading ? (
                    <LoadingCircle className="size-5" />
                ) : workspace.peopleDetails?.length ? (
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
                            {workspace.peopleDetails?.map(
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
            </CardContent>
        </Card>
    );
};

export default PeoplesTableCard;
