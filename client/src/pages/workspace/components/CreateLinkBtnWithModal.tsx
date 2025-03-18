import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoAdd } from "react-icons/io5";
import { useDispatch } from "react-redux";
import TitleText from "../../../components/TitleText";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import Modal from "../../../components/ui/Modal";
import { AppDispatch } from "../../../redux/store";
import { generateShortLinkKey } from "../../../redux/thunks/linksThunks";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";

const CreateLinkBtnWithModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

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
            <div className="flex justify-end gap-4">
                <Button
                    variant="default"
                    className="flex items-center gap-2"
                    onClick={() => setIsOpen(true)}
                >
                    <IoAdd />
                    <span>Add Link</span>
                </Button>
            </div>

            <Modal
                variant="outline"
                roundness="light"
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                className="w-[calc(100%-40px)] max-w-4xl space-y-4 overflow-y-auto"
            >
                <div className="flex flex-col gap-4">
                    <TitleText className="text-xl">New Link</TitleText>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
                    <form className="flex flex-col gap-4" onSubmit={onSubmit}>
                        <div className="flex flex-col gap-1 relative pb-4">
                            <Label htmlFor="link-name">Name</Label>
                            <Input
                                id="link-name"
                                type="text"
                                placeholder="Name"
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
                                Destination URL
                            </Label>
                            <Input
                                id="link-destinationUrl"
                                type="text"
                                placeholder="Destination URL"
                                className="w-full"
                                {...register("destinationUrl", {
                                    required: "Destination URL is required",
                                })}
                            />
                            {errors.destinationUrl && (
                                <span className="text-red-500 text-sm absolute bottom-0">
                                    {errors.destinationUrl.message as string}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1 relative pb-4">
                            <Label htmlFor="link-shortUrlKey">Short URL</Label>
                            <Input
                                id="link-shortUrlKey"
                                type="text"
                                placeholder="Short URL"
                                className="w-full"
                                {...register("shortUrlKey", {
                                    required: "Short URL is required",
                                })}
                            />
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
                                placeholder="Tags"
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
                                })}
                            />
                            {errors.comment && (
                                <span className="text-red-500 text-sm absolute bottom-0">
                                    {errors.comment.message as string}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1 relative pb-4">
                            <Label htmlFor="link-expiration-time">
                                Expiration Time
                            </Label>
                            <Input
                                id="link-expiration-time"
                                type="datetime-local"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                                {...register("expirationTime", {
                                    required: "Expiration Time is required",
                                })}
                            />
                            {errors.expirationTime && (
                                <span className="text-red-500 text-sm absolute bottom-0">
                                    {errors.expirationTime.message as string}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-1 relative pb-4">
                            <Button type="submit">Create Link</Button>
                        </div>
                    </form>
                    <div className="flex flex-col gap-1 relative pb-4">
                        <span className="bg-gray-500 w-60 h-48">
                            sdasdasdas
                        </span>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default CreateLinkBtnWithModal;
