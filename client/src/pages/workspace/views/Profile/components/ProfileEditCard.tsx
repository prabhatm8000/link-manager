import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingCircle from "@/components/ui/LoadingCircle";
import type { IUserState } from "@/redux/reducers/types";
import type { AppDispatch } from "@/redux/store";
import { updateUser } from "@/redux/thunks/usersThunk";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

const ProfileEditCard = () => {
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
        if (watch("name") !== user?.name) {
            setIsUserDetailChanged(true);
        } else {
            setIsUserDetailChanged(false);
        }
    }, [watch("name")]);
    return (
        <Card className="w-full">
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
                                value: user?.name,
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
                                value: user?.email,
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
    );
};

export default ProfileEditCard;
