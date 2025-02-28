import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "../../../components/Avatar";
import LogoutBtn from "../../../components/LogoutBtn";
import Button from "../../../components/ui/Button";
import CommingSoon from "../../../components/ui/CommingSoon";
import Input from "../../../components/ui/Input";
import LoadingCircle from "../../../components/ui/LoadingCircle";
import type {
    IUserState,
    IWorkspaceState,
} from "../../../redux/reducers/types";
import type { AppDispatch } from "../../../redux/store";
import { getMyWorkspaces } from "../../../redux/thunks/workspaceThunks";
import ViewHeader from "../components/ViewHeader";
import WorkspaceItemDetailed from "../components/WorkspaceItemDetailed";

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

    const onSubmit = handleSubmit((data) => {
        console.log(data);
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
            <ViewHeader heading="Profile" subHeading="Manage your profile" />
            <div className="flex flex-col gap-4 w-full">
                <div className="flex flex-col gap-8">
                    <div className="w-full grid grid-cols-[auto_1fr] items-center">
                        <div className="grid grid-cols-[1fr_auto] gap-2 w-fit">
                            <Avatar
                                props={{
                                    src:
                                        userState?.user?.profilePicture ||
                                        undefined,
                                    alt: userState?.user?.name,
                                    className: "w-12 h-12",
                                }}
                                title={userState?.user?.name || "U"}
                                size="lg"
                            />
                            <div className="w-fit">
                                <h3 className="text-lg font-semibold line-clamp-1">
                                    {userState?.user?.name}
                                </h3>
                                <h4 className="text-sm text-black/50 dark:text-white/50 line-clamp-1">
                                    {userState?.user?.email}
                                </h4>
                            </div>
                        </div>
                        <LogoutBtn variant="danger" className="w-fit" />
                    </div>

                    <form
                        onSubmit={onSubmit}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-2"
                    >
                        <div className="w-full">
                            <span className="text-sm opacity-50">Name</span>
                            <Input
                                {...register("name", {
                                    required: "Name is required",
                                    value: userState?.user?.name,
                                })}
                                id="name"
                                type="text"
                                placeholder="Name"
                                variant={
                                    errors.name ? "danger-outline" : "outline"
                                }
                                className="w-full"
                                autoComplete="name"
                                showlabel={false}
                            />
                            {errors.name && (
                                <span className="text-red-500 text-sm">
                                    {errors.name.message as string}
                                </span>
                            )}
                        </div>

                        <div className="w-full relative">
                            <span className="text-sm opacity-50">
                                {"Email"}
                            </span>
                            <Input
                                {...register("email", {
                                    required: "Email is required",
                                    value: userState?.user?.email,
                                })}
                                id="email"
                                type="email"
                                placeholder="Email"
                                variant={
                                    errors.email ? "danger-outline" : "outline"
                                }
                                className="w-full"
                                autoComplete="email"
                                showlabel={false}
                                disabled
                            />
                            <CommingSoon className="absolute top-0 right-0" />
                            {errors.email && (
                                <span className="text-red-500 text-sm">
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

                    <div className="flex flex-col gap-6">
                        <h3 className="text-black/50 dark:text-white/50">
                            Workspaces created
                        </h3>
                        {workspaceState.loading ? (
                            <LoadingCircle className="size-5" />
                        ) : workspaceState.myWorkspaces.length > 0 ? (
                            <div className="flex flex-col gap-4 w-full">
                                {workspaceState.myWorkspaces.map(
                                    (item, index) => (
                                        <WorkspaceItemDetailed
                                            data={item}
                                            key={index}
                                            avatarSize="md"
                                        />
                                    )
                                )}
                            </div>
                        ) : (
                            <h3 className="text-black/50 dark:text-white/50">
                                You have not created any workspace yet
                            </h3>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileView;
