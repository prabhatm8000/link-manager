import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingCircle from "@/components/ui/LoadingCircle";
import { Textarea } from "@/components/ui/textarea";
import type { IWorkspace, IWorkspaceState } from "@/redux/reducers/types";
import type { AppDispatch } from "@/redux/store";
import { updateWorkspace } from "@/redux/thunks/workspaceThunks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

const WorkspaceDetailsCard = () => {
    const workspaceState: IWorkspaceState = useSelector(
        (state: { workspace: IWorkspaceState }) => state.workspace
    );
    const workspace = workspaceState.currentWorkspace as IWorkspace;
    const dispatch = useDispatch<AppDispatch>();
    const [isChanged, setIsChanged] = useState<boolean>(false); // edit mode only
    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm();

    const onSubmit = handleSubmit((data) => {
        const { workspaceName, workspaceDescription } = data;
        dispatch(
            updateWorkspace({
                name: workspaceName,
                description: workspaceDescription,
                id: workspace?._id as string,
            })
        );
    });

    useEffect(() => {
        if (workspace) {
            setValue("workspaceName", workspace.name);
            setValue("workspaceDescription", workspace.description);
        }
    }, [workspaceState]);

    // edit mode: watching for changes
    useEffect(() => {
        if (
            workspace.name !== watch("workspaceName") ||
            workspace.description !== watch("workspaceDescription")
        ) {
            setIsChanged(true);
        } else {
            setIsChanged(false);
        }
    }, [watch("workspaceName"), watch("workspaceDescription")]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Workspace Details</CardTitle>
                <CardDescription>
                    Wanna change your workspace details?
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                    <div className="flex flex-col gap-1 relative pb-4">
                        <Label htmlFor="workspaceName">Name</Label>
                        <Input
                            id="workspaceName"
                            type="text"
                            placeholder="Ex. My Workspace"
                            className="w-full"
                            maxLength={25}
                            {...register("workspaceName", {
                                required: "Workspace name is required",
                                minLength: {
                                    value: 3,
                                    message:
                                        "Workspace name must be at least 3 characters",
                                },
                                maxLength: {
                                    value: 25,
                                    message:
                                        "Workspace name must not exceed 25 characters",
                                },
                            })}
                        />
                        {errors.workspaceName && (
                            <span className="text-red-500 text-xs absolute bottom-0">
                                {errors.workspaceName.message as string}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col gap-1 relative pb-4">
                        <Label htmlFor="workspaceDescription">
                            Description
                        </Label>
                        <Textarea
                            id="workspaceDescription"
                            placeholder="Ex. My workspace for marketing"
                            className="w-full h-40 resize-none"
                            maxLength={200}
                            {...register("workspaceDescription", {
                                maxLength: {
                                    value: 200,
                                    message:
                                        "Workspace description must not exceed 200 characters",
                                },
                            })}
                        />
                        {errors.workspaceName && (
                            <span className="text-red-500 text-xs absolute bottom-0">
                                {errors.workspaceName.message as string}
                            </span>
                        )}
                    </div>
                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={workspaceState.loading || !isChanged}
                            className="my-2 flex gap-2 items-center justify-center w-32"
                        >
                            {workspaceState.loading && (
                                <LoadingCircle className="size-5" />
                            )}
                            <span>Save</span>
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default WorkspaceDetailsCard;
