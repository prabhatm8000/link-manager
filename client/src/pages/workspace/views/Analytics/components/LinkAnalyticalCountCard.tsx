import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import type { ILinkState } from "@/redux/reducers/types";
import { useState } from "react";
import { LuMousePointerClick } from "react-icons/lu";
import { useSelector } from "react-redux";

const LinkAnalyticalCountCard = () => {
    const linkState: ILinkState = useSelector((state: any) => state.links);
    const links = linkState.links;
    type allowedLinkKeys = "shortUrlKey" | "destinationUrl";
    const cardTabs = [
        { key: "shortUrlKey", title: "Short URL" },
        { key: "destinationUrl", title: "Destination URL" },
    ];
    const [currentCardTab, setCurrentCardTab] =
        useState<allowedLinkKeys>("shortUrlKey");
    return (
        <Card className="h-full min-h-96 max-h-96 gap-3 py-2">
            <CardHeader className="flex gap-2 items-center justify-between px-2">
                <div className="flex items-center">
                    {cardTabs.map((tab) => (
                        <Button
                            variant={"ghost"}
                            key={tab.key}
                            onClick={() =>
                                setCurrentCardTab(tab.key as allowedLinkKeys)
                            }
                            className={`cursor-pointer capitalize rounded-none ${
                                currentCardTab === tab.key
                                    ? "border-b border-b-primary"
                                    : ""
                            }`}
                        >
                            {tab.title}
                        </Button>
                    ))}
                </div>

                <span className="text-xs border border-border rounded-md w-fit h-fit px-2 py-1 flex items-center justify-center gap-1">
                    <LuMousePointerClick className="size-4" />
                    Clicks
                </span>
            </CardHeader>
            <CardContent className="overflow-auto p-2">
                <div className="flex flex-col gap-2 rounded-md text-sm">
                    {links.map((item) => (
                        <div
                            key={item._id}
                            className="flex items-center justify-between px-4 py-2 bg-primary/5 border border-primary/5 rounded-md"
                        >
                            <div className="flex items-center gap-2">
                                <Avatar className="size-5 p-0">
                                    <AvatarImage
                                        src={item?.metadata?.favicon}
                                        alt={item?.metadata?.title}
                                    />
                                    <AvatarFallback itemType="link" />
                                </Avatar>
                                <span>
                                    {currentCardTab === "shortUrlKey" && "/"}
                                    {item[currentCardTab]}
                                </span>
                            </div>

                            <span>{item.clickCount}</span>
                        </div>
                    ))}

                    {links?.length === 0 && (
                        <span className="w-full h-60 flex items-center justify-center text-muted-foreground text-sm">
                            No data
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default LinkAnalyticalCountCard;
