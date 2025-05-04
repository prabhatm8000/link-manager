import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";
import LoadingCircle from "@/components/ui/LoadingCircle";
import type { IWorkspace, IWorkspaceState } from "@/redux/reducers/types";
import type { AppDispatch } from "@/redux/store";
import { deleteWorkspace } from "@/redux/thunks/workspaceThunks";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const DeleteWorkspaceCard = () => {
    const workspaceState: IWorkspaceState = useSelector(
        (state: any) => state.workspace
    );
    const dispatch = useDispatch<AppDispatch>();
    const workspace = workspaceState.currentWorkspace as IWorkspace;
    const navigate = useNavigate();
    const handleDeleteBtn = () => {
        if (!workspace) return;
        dispatch(deleteWorkspace(workspace._id)).then(() => navigate("/workspace"));
    };
    return (
        <Card className="border-destructive lg:col-span-2">
            <CardHeader>
                <CardTitle className="text-red-600">Delete Workspace</CardTitle>
                <CardDescription>
                    Are you sure you want to delete this workspace and all
                    associated data (like, links, people, etc.)? This action
                    cannot be undone.
                </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-end">
                <Button
                    className="flex gap-2 items-center w-32"
                    variant="destructive"
                    onClick={handleDeleteBtn}
                >
                    {workspaceState.loading && (
                        <LoadingCircle className="size-5" />
                    )}
                    <span>Delete</span>
                </Button>
            </CardFooter>
        </Card>
    );
};

export default DeleteWorkspaceCard;
