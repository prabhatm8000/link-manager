import { Card, CardContent } from "@/components/ui/Card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ILink, LinkDisplayConfig } from "@/redux/reducers/types";
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
    options: DropDownOptionsType[];
}) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(link.shortUrl);
        toast.success("Copied to clipboard");
    };
    return (
        <Card className="py-2 md:py-4">
            <CardContent className="flex gap-4 items-center justify-between px-2 md:px-4 w-full">
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
                    <div className="flex flex-col justify-center w-full">
                        {config.heading === "title" ? (
                            <h3 className="font-semibold">
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
                        <div className="flex flex-col lg:flex-row lg:gap-2 w-full">
                            <div className="flex gap-2 items-center text-muted-foreground w-full">
                                {config.value === "description" ? (
                                    <p
                                        className="truncate max-w-[210px] sm:max-w-[300px] lg:max-w-[500px]"
                                        title={link.metadata?.description}
                                    >
                                        {link.metadata?.description ||
                                            "No description"}
                                    </p>
                                ) : (
                                    <>
                                        <BsArrowReturnRight className="size-3" />
                                        <a
                                            href={link.destinationUrl}
                                            target="_blank"
                                        >
                                            {link.destinationUrl}
                                        </a>
                                    </>
                                )}
                            </div>
                            <div className="flex gap-2 items-center text-muted-foreground w-full">
                                {config.showCreatorAvatar && (
                                    <>
                                        <Avatar className="size-8">
                                            <AvatarImage
                                                src={
                                                    link?.creator
                                                        ?.profilePicture
                                                }
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
                                            {`${new Intl.DateTimeFormat(
                                                "en-US",
                                                {
                                                    month: "short",
                                                }
                                            ).format(
                                                new Date(link.createdAt)
                                            )} ${new Date(
                                                link.createdAt
                                            ).getDate()}`}
                                        </span>
                                    </>
                                )}
                                {config.showTags && (
                                    <>
                                        <span>
                                            {link.tags?.map(
                                                (tag) => `#${tag} `
                                            )}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {options && <LinkOptions options={options} link={link} />}
            </CardContent>
        </Card>
    );
};

export default LinkCardItem;
