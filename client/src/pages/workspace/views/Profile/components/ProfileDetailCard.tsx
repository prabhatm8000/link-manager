import LogoutBtn from "@/components/LogoutBtn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";
import CommingSoon from "@/components/ui/CommingSoon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingCircle from "@/components/ui/LoadingCircle";
import type { IUserState } from "@/redux/reducers/types";
import type { AppDispatch } from "@/redux/store";
import { updateUser } from "@/redux/thunks/usersThunk";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

const ProfileDetailCard = () => {
    const userState: IUserState = useSelector((state: any) => state.user);
    const dispatch = useDispatch<AppDispatch>();
    const user = userState.user;
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();
    const [isUserDetailChanged, setIsUserDetailChanged] = useState(false);

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
    return (
        <div className="grid grid-cols-1 md:grid-cols-[0.6fr_0.4fr] xl:grid-cols-[0.7fr_0.3fr] gap-4">
            <Card>
                <CardHeader className="flex gap-5 items-center justify-between">
                    <CardTitle className="flex gap-5 items-center">
                        <Avatar className="size-20">
                            <AvatarImage
                                src={
                                    userState?.user?.profilePicture || undefined
                                }
                                alt={userState?.user?.name}
                            />
                            <AvatarFallback>
                                {userState?.user?.name?.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="w-fit">
                            <h3 className="text-lg font-semibold line-clamp-1">
                                {user?.name}
                            </h3>
                            <h4 className="text-sm text-muted-foreground line-clamp-1">
                                {user?.email}
                            </h4>
                            {user?.lastLogin && (
                                <h4 className="text-sm text-muted-foreground line-clamp-1">
                                    Last Login:{" "}
                                    {format(
                                        new Date(user?.lastLogin),
                                        "PPPPpp"
                                    )}
                                </h4>
                            )}
                        </div>
                    </CardTitle>
                    <LogoutBtn />
                </CardHeader>
                <CardContent>
                    <CommingSoon />
                    <div>Subscriptions status...</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardDescription>
                        Wanna change your profile details?
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit} className="flex flex-col gap-3">
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
                            {errors.email && (
                                <span className="text-red-500 text-xs absolute bottom-0">
                                    {errors.email.message as string}
                                </span>
                            )}
                        </div>

                        <div className="flex w-full justify-end">
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
                </CardContent>
            </Card>
        </div>
    );
};

export default ProfileDetailCard;
