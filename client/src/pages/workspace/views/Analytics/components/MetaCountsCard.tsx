import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import type { IAnalyticsState } from "@/redux/reducers/types";
import { useState } from "react";
import { LuMousePointerClick } from "react-icons/lu";
import { useSelector } from "react-redux";
import { iconsMap } from "../../Events/components/icons";

const MetaCountsCard = () => {
    const analyticsState: IAnalyticsState = useSelector(
        (state: any) => state.analytics
    );
    const analytics = analyticsState.analytics;
    const cardTabs = ["browser", "os", "device", "region"];
    const [currentCardTab, setCurrentCardTab] =
        useState<keyof typeof analytics>("browser");
    const handleIcon = (t: keyof typeof analytics) => {
        switch (t) {
            case "browser":
                return iconsMap.getBrowserIcon;
            case "os":
                return iconsMap.getOSIcon;
            case "device":
                return iconsMap.getDeviceIcon;
            default:
                return iconsMap.getBrowserIcon;
        }
    };
    return (
        <Card className="h-full min-h-96 max-h-96 gap-3 py-2">
            <CardHeader className="flex gap-2 items-center justify-between px-2">
                <div className="flex items-center">
                    {cardTabs.map((tab) => (
                        <Button
                            variant={"ghost"}
                            key={tab}
                            onClick={() =>
                                setCurrentCardTab(tab as keyof typeof analytics)
                            }
                            className={`cursor-pointer capitalize rounded-none ${
                                currentCardTab === tab
                                    ? "border-b border-b-primary"
                                    : ""
                            }`}
                        >
                            {tab}
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
                    {Array.isArray(analytics[currentCardTab]) &&
                        analytics[currentCardTab]?.map((item) => (
                            <div
                                key={item.name}
                                className="flex items-center justify-between px-4 py-2 bg-primary/5 border border-primary/5 rounded-md"
                            >
                                <div className="flex items-center gap-2">
                                    {handleIcon(currentCardTab)(item.name)}
                                    <span className="capitalize">
                                        {item.name}
                                    </span>
                                </div>

                                <span>{item.count}</span>
                            </div>
                        ))}

                    {Array.isArray(analytics[currentCardTab]) &&
                        analytics[currentCardTab]?.length === 0 && (
                            <span className="w-full h-60 flex items-center justify-center text-muted-foreground text-sm">
                                No data
                            </span>
                        )}
                </div>
            </CardContent>
        </Card>
    );
};

export default MetaCountsCard;
