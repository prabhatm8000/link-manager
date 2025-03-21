import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoAdd, IoCalendarOutline } from "react-icons/io5";
import { RiLockPasswordLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import TitleText from "../../../components/TitleText";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import Modal from "../../../components/ui/Modal";
import { AppDispatch } from "../../../redux/store";
import { generateShortLinkKey } from "../../../redux/thunks/linksThunks";
import QRCode from "@/components/QrCode";
import { BiWorld } from "react-icons/bi";

type LinkFormType = {
    name: string;
    destinationUrl: string;
    shortUrlKey: string;
    tags?: string;
    comment?: string;
    expirationTime?: string;
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
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    const [bottomOptions, setBottomOptions] = useState(bottomOptionsInit);
    const dispatch = useDispatch<AppDispatch>();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<LinkFormType>();

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
        console.log(data);
    });

    const generateShortLinkKeyCall = async (): Promise<string> => {
        const resultAction = await dispatch(generateShortLinkKey({ size: 10 }));
        if (generateShortLinkKey.fulfilled.match(resultAction)) {
            return resultAction.payload.data;
        }
        return "";
    };

    useEffect(() => {
        generateShortLinkKeyCall().then((shortUrlKey) =>
            setValue("shortUrlKey", shortUrlKey)
        );
    }, []);
    return (
        <>
            <Modal
                variant="outline"
                roundness="light"
                isOpen={isOpen}
                onClose={onClose}
                className="w-[calc(100%-40px)] max-w-4xl space-y-8 overflow-y-auto"
            >
                <div className="flex items-center gap-2">
                    <BiWorld className="size-6" />
                    <TitleText className="text-xl">New Link</TitleText>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
                        <section className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1 relative pb-4">
                                <Label htmlFor="link-name">*Name</Label>
                                <Input
                                    id="link-name"
                                    type="text"
                                    placeholder="Ex. Example Link"
                                    className="w-full"
                                    {...register("name", {
                                        required: "Name is required",
                                        minLength: {
                                            value: 3,
                                            message:
                                                "Name must be at least 3 characters",
                                        },
                                        maxLength: {
                                            value: 25,
                                            message:
                                                "Name must not exceed 25 characters",
                                        },
                                    })}
                                />
                                {errors.name && (
                                    <span className="text-red-500 text-sm absolute bottom-0">
                                        {errors.name.message as string}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col gap-1 relative pb-4">
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

                            <div className="flex flex-col gap-1 relative pb-4">
                                <Label htmlFor="link-shortUrlKey">
                                    *Short Link
                                </Label>
                                <div className="flex gap-1 items-center w-full">
                                    <span className="text-black/50 dark:text-white/50">
                                        {import.meta.env.VITE_CLIENT_URL || ""}
                                    </span>
                                    <Input
                                        id="link-shortUrlKey"
                                        type="text"
                                        placeholder="Short Link"
                                        className="w-full"
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
                                <Input
                                    id="link-tags"
                                    type="text"
                                    placeholder="Ex. marketing, sales, etc."
                                    className="w-full"
                                    {...register("tags", {
                                        required: "Tags are required",
                                    })}
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
                                        required: "Comment is required",
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
                                        Expiration Time
                                    </Label>
                                    <Input
                                        id="link-expiration-time"
                                        type="datetime-local"
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
                                    <Label htmlFor="link-password">
                                        Password
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
                            className="flex items-center gap-2"
                            type="submit"
                        >
                            <IoAdd />
                            <span>Create Link</span>
                        </Button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default CreateLinkModal;
