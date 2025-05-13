import ArrayInput from "@/components/ArrayInput";
import QRCode from "@/components/QRCode";
import TitleText from "@/components/TitleText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingCircle from "@/components/ui/LoadingCircle";
import Modal from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/textarea";
import TOAST_MESSAGES from "@/constants/toastMessages";
import type { ILink, IWorkspaceState } from "@/redux/reducers/types";
import type { AppDispatch } from "@/redux/store";
import {
    createLink,
    fetchSiteMetadata,
    generateShortUrlKey,
    getTagsSuggestions,
    updateLink,
} from "@/redux/thunks/linksThunks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaXTwitter } from "react-icons/fa6";
import { IoMdRefresh } from "react-icons/io";
import {
    IoCalendarOutline,
    IoCopyOutline,
    IoLinkOutline,
} from "react-icons/io5";
import { RiLockPasswordLine } from "react-icons/ri";
import { VscNewline } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

type LinkFormType = {
    destinationUrl: string;
    shortUrlKey: string;
    metadata?: {
        title: string;
        description: string;
        favicon: string;
        previewImg: string;
    };
    tags?: string[];
    comment?: string;
    expirationTime?: Date;
    password?: string;
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
    const [generatingShortUrlKey, setGeneratingShortUrlKey] =
        useState<boolean>(false);
    const [shortUrl, setShortUrl] = useState<string>("");
    const [_, setFetchingMetadata] = useState<boolean>(false);
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
        watch,
    } = useForm<LinkFormType>();
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
        if (editMode && !formDataForEdit?._id)
            return toast.error(TOAST_MESSAGES.LinkNotFound);

        setFormSubmitLoading(true);

        const linkData = {
            ...data,
            tags,
            workspaceId,
        };

        bottomOptions.forEach((option: (typeof bottomOptionsInit)[0]) => {
            if (!option.show && linkData[option.key as keyof typeof linkData]) {
                delete linkData[option.key as keyof typeof linkData];
            }
        });

        return Promise.resolve()
            .then(async () => {
                if (editMode) {
                    await dispatch(
                        updateLink({
                            ...linkData,
                            linkId: formDataForEdit?._id || "",
                        })
                    );
                } else {
                    await dispatch(createLink(linkData));
                }
            })
            .then(() => {
                setFormSubmitLoading(false);
                reset();
                onClose();
            });
    });

    const handleClose = () => {
        if (editMode) reset();
        onClose();
    };

    const generateShortUrlKeyCall = async () => {
        setGeneratingShortUrlKey(true);
        const resultAction = await dispatch(generateShortUrlKey({ size: 10 }));
        if (generateShortUrlKey.fulfilled.match(resultAction)) {
            const data = resultAction.payload.data;
            setValue("shortUrlKey", data?.shortUrlKey || "");
            setShortUrl(data?.shortUrl || "");
        }
        setGeneratingShortUrlKey(false);
    };

    const fetchSiteMetadataCall = async (url: string) => {
        setFetchingMetadata(true);
        const resultAction = await dispatch(fetchSiteMetadata(url));
        if (fetchSiteMetadata.fulfilled.match(resultAction)) {
            setValue("metadata", resultAction.payload.data);
        }
        setFetchingMetadata(false);
    };

    const getTagsSuggestionsCall = async (q: string): Promise<string[]> => {
        const resultAction = await dispatch(
            getTagsSuggestions({
                workspaceId: workspaceState.currentWorkspace?._id || "",
                q,
            })
        );
        if (getTagsSuggestions.fulfilled.match(resultAction)) {
            return resultAction.payload.data;
        }
        return [];
    };

    useEffect(() => {
        if (editMode) return;
        generateShortUrlKeyCall();
    }, []);

    // fetching site metadata
    useEffect(() => {
        const url = watch("destinationUrl");
        if (!url) return;
        const timeoutId = setTimeout(() => {
            fetchSiteMetadataCall(url);
        }, 1000);
        return () => clearTimeout(timeoutId);
    }, [watch("destinationUrl")]);

    // populating the field for editmode
    useEffect(() => {
        if (!editMode) return;
        if (!formDataForEdit) return;

        setValue("destinationUrl", formDataForEdit.destinationUrl);
        setValue("shortUrlKey", formDataForEdit.shortUrlKey);
        setValue("comment", formDataForEdit.comment);
        setValue("tags", formDataForEdit.tags);
        if (formDataForEdit.expirationTime)
            setValue("expirationTime", formDataForEdit.expirationTime);
        setValue("metadata", formDataForEdit.metadata);
        setTags(formDataForEdit.tags || []);

        if (formDataForEdit.expirationTime) {
            // show expiration
            setBottomOptions((prevOptions) => {
                const newOptions = prevOptions.map((prevOption) => {
                    if (prevOption.key === "expirationTime") {
                        return { ...prevOption, show: true };
                    }
                    return prevOption;
                });
                return newOptions;
            });
        }

        if (formDataForEdit.hasPassword) {
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
            });
        }
    }, [editMode, formDataForEdit]);

    return (
        <>
            <Modal
                variant="outline"
                roundness="light"
                isOpen={isOpen}
                onClose={handleClose}
                // className="w-[calc(100%-40px)] max-w-4xl space-y-8 overflow-y-auto"
            >
                <div className="flex items-center gap-2">
                    <div className="size-[32px] border border-ring/70 rounded-full p-1">
                        {watch("metadata.favicon") ? (
                            <img
                                src={watch("metadata.favicon")}
                                alt={watch("metadata.title")}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = `${watch(
                                        "destinationUrl"
                                    )}${watch("metadata.favicon")}`;
                                }}
                            />
                        ) : (
                            <IoLinkOutline className="size-full" />
                        )}
                    </div>
                    <TitleText className="text-xl">
                        {editMode ? "Edit Link" : "New Link"}
                    </TitleText>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
                        <section className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2 relative pb-4">
                                <Label htmlFor="link-destinationUrl">
                                    *Destination URL
                                </Label>
                                <Input
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

                            <div className="flex flex-col gap-2 relative pb-4">
                                <Label htmlFor="link-shortUrlKey">
                                    *Short Link
                                </Label>
                                <div className="flex gap-1 items-center w-full">
                                    <span className="text-muted-foreground">
                                        {import.meta.env.VITE_CLIENT_URL || ""}
                                    </span>
                                    <Input
                                        disabled={editMode}
                                        id="link-shortUrlKey"
                                        type="text"
                                        placeholder="Short Link"
                                        className="w-full"
                                        maxLength={10}
                                        {...register("shortUrlKey", {
                                            required: "Short URL is required",
                                        })}
                                    />
                                    <Button
                                        disabled={
                                            editMode || generatingShortUrlKey
                                        }
                                        type="button"
                                        variant={"outline"}
                                        size={"icon"}
                                        title="Generate Short Link"
                                        onClick={() =>
                                            generateShortUrlKeyCall()
                                        }
                                    >
                                        {generatingShortUrlKey ? (
                                            <LoadingCircle className="size-4" />
                                        ) : (
                                            <IoMdRefresh className="size-5" />
                                        )}
                                    </Button>
                                </div>
                                {errors.shortUrlKey && (
                                    <span className="text-red-500 text-sm absolute bottom-0">
                                        {errors.shortUrlKey.message as string}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col gap-2 relative pb-4">
                                <Label htmlFor="link-tags">Tags</Label>
                                <ArrayInput
                                    inputProps={{
                                        id: "link-tags",
                                        type: "text",
                                        placeholder:
                                            "Ex. marketing, sales, etc.",
                                        className: "w-full",
                                    }}
                                    limit={5}
                                    arrayValues={tags}
                                    setArrayValues={setTags}
                                    getSuggestions={getTagsSuggestionsCall}
                                />
                                {errors.tags && (
                                    <span className="text-red-500 text-sm absolute bottom-0">
                                        {errors.tags.message as string}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col gap-2 relative pb-4">
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
                                <div className="flex flex-col gap-2 relative pb-4">
                                    <Label>
                                        <span>Expiration Time</span>
                                    </Label>
                                    <div className="flex gap-1 items-center w-full">
                                        <Input
                                            type="text"
                                            value={
                                                watch("expirationTime")
                                                    ? new Date(
                                                          watch(
                                                              "expirationTime"
                                                          ) || ""
                                                      ).toLocaleString()
                                                    : ""
                                            }
                                            placeholder="Ex. 4/15/2025, 5:19:00 PM"
                                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                                        />
                                        <Button
                                            type="button"
                                            variant={"outline"}
                                            size={"icon"}
                                        >
                                            <Label htmlFor="link-expiration-time">
                                                <IoCalendarOutline className="size-5" />
                                                <input
                                                    id="link-expiration-time"
                                                    type="datetime-local"
                                                    className="absolute opacity-0"
                                                    onFocus={(e) => {
                                                        e.target.showPicker();
                                                    }}
                                                    {...register(
                                                        "expirationTime",
                                                        {
                                                            required:
                                                                "Expiration Time is required",
                                                        }
                                                    )}
                                                />
                                            </Label>
                                        </Button>
                                    </div>
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
                                <div className="flex flex-col gap-2 relative pb-4">
                                    <Label htmlFor="link-password">
                                        <span>Password</span>
                                    </Label>
                                    <div className="flex gap-2 items-center w-full">
                                        <Input
                                            id="link-password"
                                            type="password"
                                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                                            {...register("password", {
                                                required:
                                                    "Password is required",
                                            })}
                                        />
                                    </div>
                                    {errors.password && (
                                        <span className="text-red-500 text-sm absolute bottom-0">
                                            {errors.password.message as string}
                                        </span>
                                    )}
                                </div>
                            )}
                        </section>

                        <section className="flex flex-col gap-2 relative">
                            <div>
                                <QRCode url={shortUrl} />
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label>Share</Label>
                                <div className="flex gap-2 justify-around">
                                    <IoCopyOutline className="size-8 border border-input p-2 rounded-md" />
                                    <FaXTwitter className="size-8 border border-input p-2 rounded-md" />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Label>Link Preview</Label>
                                <div className="border border-ring/50 rounded-md">
                                    <img
                                        src={watch("metadata.previewImg")}
                                        className="w-full h-40 object-cover"
                                        alt=""
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Input
                                        style={{
                                            fontSize: "12px",
                                            fontWeight: "bold",
                                        }}
                                        className="p-0 h-5 border-0 rounded-none focus-visible:ring-0 focus-visible:border-0"
                                        placeholder="Add a title"
                                        {...register("metadata.title")}
                                    />
                                    <Textarea
                                        style={{ fontSize: "12px" }}
                                        className="p-0 text-xs h-5 border-0 rounded-none focus-visible:ring-0 focus-visible:border-0"
                                        placeholder="Add a description"
                                        {...register("metadata.description")}
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 relative pb-4 justify-between">
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
                            <span>
                                {editMode ? "Update Link" : "Create Link"}
                            </span>
                            {formSubmitLoading ? (
                                <LoadingCircle className="size-5" />
                            ) : (
                                <VscNewline className="size-5" />
                            )}
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default CreateLinkModal;
