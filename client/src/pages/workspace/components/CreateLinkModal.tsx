import ArrayInput from "@/components/ArrayInput";
import QRCode from "@/components/QRCode";
import CommingSoon from "@/components/ui/CommingSoon";
import { Label } from "@/components/ui/label";
import LoadingCircle from "@/components/ui/LoadingCircle";
import { Textarea } from "@/components/ui/textarea";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import TOAST_MESSAGES from "@/constants/toastMessages";
import type { ILink, IWorkspaceState } from "@/redux/reducers/types";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoIosLink } from "react-icons/io";
import { IoAdd, IoCalendarOutline } from "react-icons/io5";
import { RiLockPasswordLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import TitleText from "../../../components/TitleText";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import Modal from "../../../components/ui/Modal";
import { AppDispatch } from "../../../redux/store";
import {
    createLink,
    generateShortLinkKey,
    updateLink,
} from "../../../redux/thunks/linksThunks";

type LinkFormType = {
    destinationUrl: string;
    shortUrlKey: string;
    tags?: string[];
    comment?: string;
    expirationTime?: string | string[];
    password?: string;
};

const initState: LinkFormType = {
    destinationUrl: "some-url",
    shortUrlKey: "dfdfdfdfdfdfdf",
    tags: ["helo", "world"],
    comment: "ooooooooooooha,",
    expirationTime: "1, 2, 3",
    password: "",
};

const bottomOptionsInit = [
    {
        label: "Expiration Time",
        icon: <IoCalendarOutline className="size-4" />,
        key: "expirationTime",
        show: false,
    },
    {
        label: "Password",
        icon: <RiLockPasswordLine className="size-4" />,
        key: "password",
        show: false,
    },
];

const CreateLinkModal = ({
    isOpen,
    onClose,
    editMode = false,
    formDataForEdit,
}: {
    isOpen: boolean;
    onClose: () => void;
    editMode?: boolean;
    formDataForEdit?: ILink;
}) => {
    const [bottomOptions, setBottomOptions] = useState(bottomOptionsInit);
    const [formSubmitLoading, setFormSubmitLoading] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();
    const workspaceState: IWorkspaceState = useSelector(
        (state: any) => state.workspace
    );
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        reset,
        getValues,
    } = useForm<LinkFormType>({ values: initState });
    const [tags, setTags] = useState<string[]>(getValues("tags") || []);

    const handleOptionClick = (option: (typeof bottomOptionsInit)[0]) => {
        setBottomOptions((prevOptions) => {
            const newOptions = prevOptions.map((prevOption) => {
                if (prevOption.key === option.key) {
                    return { ...prevOption, show: !prevOption.show };
                }
                return prevOption;
            });
            return newOptions;
        });
    };

    const onSubmit = handleSubmit((data) => {
        const workspaceId = workspaceState?.currentWorkspace?._id;
        if (!workspaceId) return toast.error(TOAST_MESSAGES.NoCurrentWorkspace);
        setFormSubmitLoading(true);
        const expirationTimeArray = Array.isArray(data.expirationTime)
            ? data.expirationTime
            : data.expirationTime?.split(",").map((d) => d.trim());

        return Promise.resolve()
            .then(async () => {
                if (editMode) {
                    await dispatch(
                        updateLink({
                            ...data,
                            tags,
                            expirationTime: expirationTimeArray,
                            workspaceId,
                            linkId: formDataForEdit?._id as string,
                        })
                    );
                } else {
                    await dispatch(
                        createLink({
                            ...data,
                            tags,
                            expirationTime: expirationTimeArray,
                            workspaceId,
                        })
                    );
                }
            })
            .then(() => {
                setFormSubmitLoading(false);
                reset();
                onClose();
            });

        // if (!editMode) {
        //     dispatch(
        //         createLink({
        //             ...data,
        //             tags,
        //             expirationTime: expirationTimeArray,
        //             workspaceId,
        //         })
        //     ).then(() => {
        //         setFormSubmitLoading(false);
        //         reset();
        //         onClose();
        //     });
        // } else {
        //     dispatch(
        //         createLink({
        //             ...data,
        //             tags,
        //             expirationTime: expirationTimeArray,
        //             workspaceId,
        //         })
        //     ).then(() => {
        //         setFormSubmitLoading(false);
        //         reset();
        //         onClose();
        //     });
        // }
    });

    const handleClose = () => {
        if (editMode) reset();
        onClose();
    }

    const generateShortLinkKeyCall = async (): Promise<string> => {
        const resultAction = await dispatch(generateShortLinkKey({ size: 10 }));
        if (generateShortLinkKey.fulfilled.match(resultAction)) {
            return resultAction.payload.data;
        }
        return "";
    };

    useEffect(() => {
        if (editMode) return;
        generateShortLinkKeyCall().then((shortUrlKey) =>
            setValue("shortUrlKey", shortUrlKey)
        );
    }, []);

    // populating the field for editmode
    useEffect(() => {
        if (!editMode) return;
        if (!formDataForEdit) return;

        setValue("destinationUrl", formDataForEdit.destinationUrl);
        setValue("shortUrlKey", formDataForEdit.shortUrlKey);
        setValue("comment", formDataForEdit.comment);
        setValue("tags", formDataForEdit.tags);
        setTags(formDataForEdit.tags || []);

        if (formDataForEdit.expirationTime) {
            setValue(
                "expirationTime",
                formDataForEdit.expirationTime?.map((d) => d).join(",")
            );
            
            // show expiration
            setBottomOptions((prevOptions) => {
                const newOptions = prevOptions.map((prevOption) => {
                    if (prevOption.key === "expirationTime") {
                        return { ...prevOption, show: true };
                    }
                    return prevOption;
                });
                return newOptions;
            })
        }

        if (formDataForEdit.password) {
            setValue("password", formDataForEdit.password);

            // show password
            setBottomOptions((prevOptions) => {
                const newOptions = prevOptions.map((prevOption) => {
                    if (prevOption.key === "password") {
                        return { ...prevOption, show: true };
                    }
                    return prevOption;
                });
                return newOptions;
            })
        }
    }, [editMode, formDataForEdit]);

    return (
        <>
            <Modal
                variant="outline"
                roundness="light"
                isOpen={isOpen}
                onClose={handleClose}
                className="w-[calc(100%-40px)] max-w-4xl space-y-8 overflow-y-auto"
            >
                <div className="flex items-center gap-2">
                    <IoIosLink className="size-6" />
                    <TitleText className="text-xl">
                        {editMode ? "Edit Link" : "New Link"}
                    </TitleText>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
                        <section className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1 relative pb-4">
                                <Label htmlFor="link-destinationUrl">
                                    *Destination URL
                                </Label>
                                <Input
                                    disabled={editMode}
                                    id="link-destinationUrl"
                                    type="text"
                                    placeholder="Ex. https://example.com"
                                    className="w-full"
                                    {...register("destinationUrl", {
                                        required: "Destination URL is required",
                                    })}
                                />
                                {errors.destinationUrl && (
                                    <span className="text-red-500 text-sm absolute bottom-0">
                                        {
                                            errors.destinationUrl
                                                .message as string
                                        }
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col gap-1 relative pb-4">
                                <Label htmlFor="link-shortUrlKey">
                                    *Short Link
                                </Label>
                                <div className="flex gap-1 items-center w-full">
                                    <span className="text-muted-foreground">
                                        {import.meta.env.VITE_CLIENT_URL || ""}
                                    </span>
                                    <Input
                                        id="link-shortUrlKey"
                                        type="text"
                                        placeholder="Short Link"
                                        className="w-full"
                                        maxLength={10}
                                        {...register("shortUrlKey", {
                                            required: "Short URL is required",
                                        })}
                                    />
                                </div>
                                {errors.shortUrlKey && (
                                    <span className="text-red-500 text-sm absolute bottom-0">
                                        {errors.shortUrlKey.message as string}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col gap-1 relative pb-4">
                                <Label htmlFor="link-tags">Tags</Label>
                                {/* <Input
                                    id="link-tags"
                                    type="text"
                                    placeholder="Ex. marketing, sales, etc."
                                    className="w-full"
                                    {...register("tags", {
                                        required: "Tags are required",
                                    })}
                                /> */}
                                <ArrayInput
                                    inputProps={{
                                        id: "link-tags",
                                        type: "text",
                                        placeholder:
                                            "Ex. marketing, sales, etc.",
                                        className: "w-full",
                                    }}
                                    arrayValues={tags}
                                    setArrayValues={setTags}
                                />
                                {errors.tags && (
                                    <span className="text-red-500 text-sm absolute bottom-0">
                                        {errors.tags.message as string}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col gap-1 relative pb-4">
                                <Label htmlFor="link-comment">Comment</Label>
                                <Textarea
                                    id="link-comment"
                                    placeholder="Comment"
                                    className="w-full h-24"
                                    style={{ resize: "none" }}
                                    {...register("comment", {
                                        maxLength: {
                                            value: 250,
                                            message:
                                                "Comment must not exceed 250 characters",
                                        },
                                    })}
                                />
                                {errors.comment && (
                                    <span className="text-red-500 text-sm absolute bottom-0">
                                        {errors.comment.message as string}
                                    </span>
                                )}
                            </div>

                            {bottomOptions.find(
                                (option) =>
                                    option.key === "expirationTime" &&
                                    option.show
                            ) && (
                                <div className="flex flex-col gap-1 relative pb-4">
                                    <Label htmlFor="link-expiration-time">
                                        <span>Expiration Time</span>
                                        <Tooltip>
                                            <TooltipTrigger
                                                type="button"
                                                className="w-fit"
                                            >
                                                <Info className="w-4 h-4" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="text-center">
                                                    can be any of the following,
                                                    even multiple <br />{" "}
                                                    separated by comma: 1min,
                                                    1h, 1d, 1w, 1m, 1y
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </Label>
                                    <Input
                                        id="link-expiration-time"
                                        type="text"
                                        placeholder="Ex. 1min, 1h, 1d, 1w, 1m, 1y"
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        {...register("expirationTime", {
                                            required:
                                                "Expiration Time is required",
                                        })}
                                    />
                                    {errors.expirationTime && (
                                        <span className="text-red-500 text-sm absolute bottom-0">
                                            {
                                                errors.expirationTime
                                                    .message as string
                                            }
                                        </span>
                                    )}
                                </div>
                            )}

                            {bottomOptions.find(
                                (option) =>
                                    option.key === "password" && option.show
                            ) && (
                                <div className="flex flex-col gap-1 relative pb-4">
                                    <CommingSoon text="*not super secure [as of now]" />
                                    <Label htmlFor="link-password">
                                        <span>Password</span>
                                        <Tooltip>
                                            <TooltipTrigger
                                                type="button"
                                                className="w-fit"
                                            >
                                                <Info className="w-4 h-4" />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="text-center">
                                                    Not super secure [as of now]
                                                    why? you ask. <br />
                                                    there is no hashing, it's
                                                    just like an access key
                                                </p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </Label>
                                    <Input
                                        id="link-password"
                                        type="password"
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        {...register("password", {
                                            required: "Password is required",
                                        })}
                                    />
                                    {errors.password && (
                                        <span className="text-red-500 text-sm absolute bottom-0">
                                            {errors.password.message as string}
                                        </span>
                                    )}
                                </div>
                            )}
                        </section>
                        <section className="flex flex-col gap-1 relative">
                            <QRCode url="https://example.com" />
                        </section>
                    </div>

                    <div className="flex gap-4 relative pb-4 justify-between">
                        <div className="flex gap-4">
                            {bottomOptions.map((option) => (
                                <div
                                    key={option.key}
                                    className="flex gap-1 items-center"
                                >
                                    <Button
                                        type="button"
                                        variant={
                                            option.show ? "default" : "outline"
                                        }
                                        className="flex items-center gap-2"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleOptionClick(option);
                                        }}
                                    >
                                        {option.icon}
                                        <span>{option.label}</span>
                                    </Button>
                                </div>
                            ))}
                        </div>
                        <Button
                            disabled={formSubmitLoading}
                            className="flex items-center gap-2"
                            type="submit"
                        >
                            {formSubmitLoading ? (
                                <LoadingCircle className="size-5" />
                            ) : (
                                <IoAdd className="size-5" />
                            )}
                            <span>
                                {editMode ? "Update Link" : "Create Link"}
                            </span>
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default CreateLinkModal;
