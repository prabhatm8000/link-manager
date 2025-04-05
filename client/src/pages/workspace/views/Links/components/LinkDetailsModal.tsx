import TitleText from "@/components/TitleText";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";
import { Label } from "@/components/ui/label";
import Modal from "@/components/ui/Modal";
import type { ILink, ILinkState } from "@/redux/reducers/types";
import { AiOutlineDelete } from "react-icons/ai";
import { IoIosLink } from "react-icons/io";
import { TbEdit } from "react-icons/tb";
import { useSelector } from "react-redux";

const LinkDetailsModal = ({
    linkId,
    isOpen,
    onClose,
    onOpenDelete,
    onOpenEdit,
}: {
    linkId: string;
    isOpen: boolean;
    onClose: () => void;
    onOpenDelete: (link: ILink) => void;
    onOpenEdit: (link: ILink) => void;
}) => {
    const mainText = "Link Details";
    const linkState: ILinkState = useSelector((state: any) => state.links);
    const link = linkState.links.find((link: ILink) => link._id === linkId);
    
    if (!link) {
        return <div>Link not found</div>;
    }

    // const dispatch = useDispatch<AppDispatch>();
    const linkDetailRenderer = [
        {
            label: "Short Link",
            type: "link",
            value: "/" + link.shortUrlKey,
        },
        {
            label: "Destination URL",
            type: "link",
            value: link.destinationUrl,
        },
        {
            label: "Tags",
            type: "array",
            value: link.tags,
        },
        {
            label: "Status",
            type: "text",
            value: link.isActive ? (
                <span className="inline-block bg-green-500 text-foreground rounded-full px-3 py-1 text-xs font-semibold">
                    {" "}
                    Active
                </span>
            ) : (
                <span className="inline-block bg-red-500 text-foreground rounded-full px-3 py-1 text-xs font-semibold">
                    Inactive
                </span>
            ),
        },
        {
            label: "Comment",
            type: "text",
            value: link.comment,
        },
        {
            label: "Expiration Time",
            type: "text",
            value: link.expirationTime,
        },
        {
            label: "Password protected",
            value: link?.password,
        },
    ];

    const creatorDetailRenderer = [
        {
            label: "Profile Picture",
            type: "link",
            value: link?.creator?.profilePicture,
        },
        {
            label: "Name",
            type: "text",
            value: link?.creator?.name,
        },
        {
            label: "Email",
            type: "text",
            value: link?.creator?.email,
        },
        {
            label: "Last Login",
            type: "text",
            value:
                link?.creator?.lastLogin &&
                new Date(link?.creator?.lastLogin).toISOString(),
        },
    ];

    return (
        <>
            <Modal
                variant="outline"
                roundness="light"
                isOpen={isOpen}
                onClose={onClose}
            >
                <div className="flex items-center gap-2 mb-4">
                    <IoIosLink className="size-6" />
                    <TitleText className="text-xl">{mainText}</TitleText>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full h-fit min-w-80 max-w-3xl">
                    <Card className="h-fit">
                        <CardHeader>
                            <CardTitle className="text-xl">Link</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            {linkDetailRenderer.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col justify-center gap-1"
                                >
                                    <Label className="text-sm text-muted-foreground">
                                        {item.label}
                                    </Label>
                                    {item.type === "link" &&
                                    typeof item.value === "string" ? (
                                        <a
                                            href={item.value}
                                            target="_blank"
                                            className="text-blue-400"
                                        >
                                            {item.value}
                                        </a>
                                    ) : item.type === "array" &&
                                      Array.isArray(item.value) ? (
                                        <p className="flex flex-wrap gap-1">
                                            {item?.value?.map((v) => (
                                                <span
                                                    key={v}
                                                    className="inline-block bg-muted-foreground/20 text-foreground rounded-full px-3 py-1 text-xs font-semibold"
                                                >
                                                    {v}
                                                </span>
                                            ))}
                                        </p>
                                    ) : (
                                        <p>{item.value || "-"}</p>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter className="grid grid-cols-2 gap-2">
                            <Button
                                onClick={() => onOpenEdit(link)}
                                variant={"secondary"}
                                className="flex gap-2 items-center justify-center w-full hover:bg-foreground/10 dark:hover:bg-foreground/10"
                            >
                                <TbEdit />
                                <span>{"Edit"}</span>
                            </Button>
                            <Button
                                className="flex gap-2 items-center justify-center w-full hover:bg-red-200 dark:hover:bg-red-950"
                                variant="secondary"
                                onClick={() => onOpenDelete(link)}
                            >
                                <AiOutlineDelete className="text-red-500" />
                                <span>{"Delete"}</span>
                            </Button>
                        </CardFooter>
                    </Card>

                    <div className="flex flex-col gap-4">
                        <Card className="min-w-80 h-fit">
                            <CardHeader>
                                <CardTitle className="text-xl">
                                    Creator
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {creatorDetailRenderer.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col justify-center gap-1"
                                    >
                                        <Label className="text-sm text-muted-foreground">
                                            {item.label}
                                        </Label>
                                        {item.type === "link" &&
                                        typeof item.value === "string" ? (
                                            <a
                                                href={item.value}
                                                target="_blank"
                                                className="text-blue-400"
                                            >
                                                {item.value}
                                            </a>
                                        ) : (
                                            <p>{item.value || "-"}</p>
                                        )}
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                        <Card className="min-w-80 h-full">
                            <CardHeader>
                                <CardTitle className="text-xl">
                                    Events
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>later...</p>
                            </CardContent>
                        </Card>
                    </div>
                    {/*                     
                    <div className="flex flex-col items-center gap-2">
                        <TitleText className="text-lg">Short link:</TitleText>
                        <a
                            href={`/${link.shortUrlKey}`}
                            target="_blank"
                            className="text-blue-400"
                        >
                            /{link.shortUrlKey}
                        </a>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <TitleText className="text-lg">Destination:</TitleText>
                        <a
                            href={link.destinationUrl}
                            target="_blank"
                            className="text-blue-400"
                        >
                            {link.destinationUrl}
                        </a>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <TitleText className="text-lg">Comment:</TitleText>
                        <p className="text-muted-foreground">{link.comment}</p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <TitleText className="text-lg">Link Tags:</TitleText>
                        <div>
                            {link?.tags?.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-block bg-muted-foreground/20 text-foreground rounded-full px-3 py-1 text-xs font-semibold"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <TitleText className="text-lg">
                            Link Created By:
                        </TitleText>
                        <p className="text-muted-foreground">
                            {link.creator?.name}
                        </p>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <TitleText className="text-lg">Link Status:</TitleText>
                        <p className="text-muted-foreground">{link.isActive}</p>
                    </div> */}
                </div>
            </Modal>
        </>
    );
};

export default LinkDetailsModal;
