import ClickCountSpan from "@/components/ClickCountSpan";
import { Card, CardContent } from "@/components/ui/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ILink, LinkDisplayConfig } from "@/redux/reducers/types";
import { format } from "date-fns";
import { useState } from "react";
import { BsArrowReturnRight } from "react-icons/bs";
import { VscCopy } from "react-icons/vsc";
import { toast } from "sonner";
import type { DropDownOptionsType } from "../types";
import LinkOptions from "./LinkOptions";

const LinkCardItem = ({
    link,
    config,
    options,
}: {
    link: ILink;
    config: LinkDisplayConfig;
    options?: DropDownOptionsType[];
}) => {
    const [extended, setExtended] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(link.shortUrl);
        toast.success("Copied to clipboard");
    };
    return (
        <Card className="py-2 md:py-4">
            <CardContent className="grid grid-cols-[1fr_auto] gap-4 items-center justify-between px-2 md:px-4 w-full">
                <div className="flex gap-2 md:gap-4 items-center text-sm w-full">
                    <div>
                        <Avatar>
                            <AvatarImage
                                src={link?.metadata?.favicon}
                                alt={link?.metadata?.title}
                            />
                            <AvatarFallback itemType="link" />
                        </Avatar>
                    </div>
                    <div className="flex flex-col justify-center">
                        {config.heading === "title" ? (
                            <h3
                                className="font-semibold line-clamp-1 w-full"
                                title={link.metadata?.title}
                            >
                                {link.metadata?.title || "Untitled"}
                            </h3>
                        ) : (
                            <div className="flex items-center gap-2">
                                <a
                                    href={`${link.shortUrl}`}
                                    target="_blank"
                                    className="font-semibold"
                                >
                                    {link.shortUrl.split("//")[1]}
                                </a>
                                <span
                                    onClick={handleCopy}
                                    className="cursor-pointer"
                                >
                                    <VscCopy className="size-4" />
                                </span>
                            </div>
                        )}
                        {config.value === "description" ? (
                            <p
                                className={`${extended ? "" : "line-clamp-1"} w-full`}
                                title={link.metadata?.description}
                                onClick={() => setExtended(p => !p)}
                            >
                                {link.metadata?.description || "No description"}
                            </p>
                        ) : (
                            <span className="flex items-center gap-2">
                                <BsArrowReturnRight className="size-3" />
                                <a href={link.destinationUrl} target="_blank">
                                    {link.destinationUrl}
                                </a>
                            </span>
                        )}
                        <div className="flex gap-2 items-center text-muted-foreground w-full">
                            {config.showCreatorAvatar && (
                                <>
                                    <Avatar
                                        className="size-8"
                                        title={link?.creator?.name}
                                    >
                                        <AvatarImage
                                            src={link?.creator?.profilePicture}
                                            alt={link?.creator?.name}
                                        />
                                        <AvatarFallback itemType="user">
                                            {link?.creator?.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                </>
                            )}
                            {config.showCreatedAt && (
                                <>
                                    <span>
                                        {`${format(
                                            new Date(link.createdAt),
                                            "PPP"
                                        )} at ${format(
                                            new Date(link.createdAt),
                                            "hh:mm a"
                                        )}`}
                                    </span>
                                </>
                            )}
                            {config.showTags && (
                                <>
                                    <span className="line-clamp-1">
                                        {link.tags?.map((tag) => `#${tag} `)}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 items-center justify-end w-full">
                    {config.showAnalytics && (
                        <ClickCountSpan count={link.clickCount} />
                    )}
                    {options && <LinkOptions options={options} link={link} />}
                </div>
            </CardContent>
        </Card>
    );
};

export default LinkCardItem;
