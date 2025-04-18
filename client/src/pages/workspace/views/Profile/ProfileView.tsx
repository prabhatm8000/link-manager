import LogoutBtn from "@/components/LogoutBtn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import CommingSoon from "@/components/ui/CommingSoon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingCircle from "@/components/ui/LoadingCircle";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { IUserState, IWorkspaceState } from "@/redux/reducers/types";
import type { AppDispatch } from "@/redux/store";
import { updateUser } from "@/redux/thunks/usersThunk";
import { getMyWorkspaces } from "@/redux/thunks/workspaceThunks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdAdd } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import CreateWorkspaceModal from "../Settings/components/CreateWorkspaceModal";
import WorkspaceItemDetailed from "../Settings/components/WorkspaceItemDetailed";

const ProfileView = () => {
    const userState: IUserState = useSelector((state: any) => state.user);
    const workspaceState: IWorkspaceState = useSelector(
        (state: any) => state.workspace
    );
    const dispatch = useDispatch<AppDispatch>();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    const [isUserDetailChanged, setIsUserDetailChanged] = useState(false);
    const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] =
        useState<boolean>(false);

    const onSubmit = handleSubmit((data) => {
        dispatch(
            updateUser({
                name: data.name,
            })
        );
    });

    // watching for changes in the user details form and updating the user's details in the database
    // only for name, (email, coming soon!)
    useEffect(() => {
        if (watch("name") !== userState.user?.name) {
            setIsUserDetailChanged(true);
        } else {
            setIsUserDetailChanged(false);
        }
    }, [watch("name")]);

    useEffect(() => {
        if (workspaceState.myWorkspaces.length > 0) return;
        dispatch(getMyWorkspaces());
    }, []);

    if (!userState?.user) return null;
    return (
        <>
            <div className="flex flex-col gap-4 w-full">
                <div className="space-y-8">
                    {/* user info */}
                    <div className="w-full grid grid-cols-[1fr_auto] gap-2 items-center">
                        <div className="grid grid-cols-[1fr_auto] gap-2 w-fit">
                            <Avatar>
                                <AvatarImage
                                    src={
                                        userState?.user?.profilePicture ||
                                        undefined
                                    }
                                    alt={userState?.user?.name}
                                />
                                <AvatarFallback>
                                    {userState?.user?.name?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="w-fit">
                                <h3 className="text-lg font-semibold line-clamp-1">
                                    {userState?.user?.name}
                                </h3>
                                <h4 className="text-sm text-muted-foreground line-clamp-1">
                                    {userState?.user?.email}
                                </h4>
                                {userState?.user?.lastLogin && (
                                    <h4 className="text-sm text-muted-foreground line-clamp-1">
                                        {new Date(
                                            userState?.user?.lastLogin
                                        ).toLocaleString()}
                                    </h4>
                                )}
                            </div>
                        </div>
                        <LogoutBtn className="w-fit" />
                    </div>

                    {/* edit form */}
                    <form
                        onSubmit={onSubmit}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-3"
                    >
                        <div className="flex flex-col gap-1 relative pb-4">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                {...register("name", {
                                    required: "Name is required",
                                    value: userState?.user?.name,
                                })}
                                id="name"
                                type="text"
                                placeholder="Name"
                                className="w-full"
                                autoComplete="name"
                            />
                            {errors.name && (
                                <span className="text-red-500 text-xs absolute bottom-0">
                                    {errors.name.message as string}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1 relative pb-4">
                            <Label htmlFor="email" className="opacity-50">
                                Email
                            </Label>
                            <Input
                                {...register("email", {
                                    required: "Email is required",
                                    value: userState?.user?.email,
                                })}
                                id="email"
                                type="email"
                                placeholder="Email"
                                className="w-full"
                                autoComplete="email"
                                disabled
                            />
                            <CommingSoon className="absolute top-0 right-0" />
                            {errors.email && (
                                <span className="text-red-500 text-xs absolute bottom-0">
                                    {errors.email.message as string}
                                </span>
                            )}
                        </div>

                        <div className="lg:col-span-2 flex w-full justify-end">
                            <Button
                                disabled={
                                    userState?.loading || !isUserDetailChanged
                                }
                                type="submit"
                                className="my-4 flex items-center justify-center gap-2 w-24 "
                            >
                                {userState?.loading && (
                                    <LoadingCircle className="size-5" />
                                )}
                                <span>Save</span>
                            </Button>
                        </div>
                    </form>

                    {/* my workspaces */}
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center gap-3">
                            <h3 className="text-muted-foreground">
                                My Workspaces
                            </h3>
                            <Button
                                onClick={() =>
                                    setShowCreateWorkspaceModal(true)
                                }
                                variant={"default"}
                                className="flex gap-2 items-center justify-start"
                            >
                                <MdAdd />
                                <span>{"Create Workspace"}</span>
                            </Button>
                        </div>

                        {workspaceState.loading ? (
                            <LoadingCircle className="size-5" />
                        ) : workspaceState.myWorkspaces.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">
                                            Name
                                        </TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {workspaceState.myWorkspaces.map(
                                        (item, index) => (
                                            <WorkspaceItemDetailed
                                                data={item}
                                                key={index}
                                                avatarSize="md"
                                            />
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        ) : (
                            <h3 className="text-muted-foreground">
                                You have not created any workspace yet!
                            </h3>
                        )}
                    </div>
                    <CreateWorkspaceModal
                        isOpen={showCreateWorkspaceModal}
                        onClose={() => setShowCreateWorkspaceModal(false)}
                    />
                </div>
            </div>
        </>
    );
};

export default ProfileView;
