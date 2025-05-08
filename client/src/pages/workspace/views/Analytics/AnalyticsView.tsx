import DateRangePicker from "@/components/DateRangePicker";
import LinkDropdown from "@/components/LinkDropdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/Card";
import LoadingCircle from "@/components/ui/LoadingCircle";
import { clearState } from "@/redux/reducers/analytics";
import type {
    IAnalyticsState,
    ILink,
    ILinkState,
} from "@/redux/reducers/types";
import { AppDispatch } from "@/redux/store";
import { getAnalytics } from "@/redux/thunks/analyticsThunks";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { HiCursorClick } from "react-icons/hi";
import { IoMdRefresh } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import LinkCardItem from "../Links/components/LinkCardItem";
import LinkAnalyticalCountCard from "./components/LinkAnalyticalCountCard";
import MetaCountsCard from "./components/MetaCountsCard";
import TotalClicksChart from "./components/TotalClicksChart";

const AnalyticsView = () => {
    const [_, setSearchQuery] = useSearchParams();
    const linkState: ILinkState = useSelector((state: any) => state.links);
    const analyticsState: IAnalyticsState = useSelector(
        (state: any) => state.analytics
    );
    const dispatch = useDispatch<AppDispatch>();
    const [selectedLink, setSelectedLink] = useState<ILink | undefined>(
        linkState.links.length > 0 ? linkState.links[0] : undefined
    );
    const [refresh, setRefresh] = useState<boolean>(false);
    const [dateRange, setDateRange] = useState<{
        startDate: string;
        endDate: string;
    }>({
        startDate: new Date(
            new Date().setDate(new Date().getDate() - 1)
        ).toDateString(),
        endDate: new Date().toDateString(),
    });

    const handleAllDates = () => {
        setDateRange({
            startDate: "",
            endDate: "",
        });
    };

    const handleRefreshEvents = () => {
        dispatch(clearState());
        setRefresh((prev) => !prev);
    };

    const handleSwitchToEvents = () => {
        setSearchQuery((prev) => {
            prev.set("tab", "events");
            return prev;
        });
    };

    const handleLinkSelect = (link?: ILink) => {
        setSelectedLink(link);
    };

    useEffect(() => {
        if (!selectedLink) {
            setSelectedLink(
                linkState.links.length > 0 ? linkState.links[0] : undefined
            );
            return;
        }
        if (!dateRange.startDate && !dateRange.endDate) {
            return;
        }

        dispatch(
            getAnalytics({
                linkId: selectedLink?._id,
                workspaceId: selectedLink?.workspaceId,
                startDate: dateRange.startDate
                    ? format(dateRange.startDate, "yyyy-MM-dd")
                    : undefined,
                endDate: dateRange.endDate
                    ? format(dateRange.endDate, "yyyy-MM-dd")
                    : undefined,
                grouping: "daily",
            })
        );
    }, [linkState, selectedLink, dateRange, refresh, dispatch]);

    return (
        <div className="pb-4 flex flex-col gap-4">
            <Card className="py-4">
                <CardContent className="px-4 flex gap-2 items-center justify-between">
                    <CardTitle className="text-muted-foreground flex items-center gap-0">
                        <span>Analytics</span>
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            className="text-foreground"
                            disabled={analyticsState.loading}
                            onClick={handleRefreshEvents}
                        >
                            {analyticsState.loading ? (
                                <LoadingCircle className="size-4" />
                            ) : (
                                <IoMdRefresh className="cursor-pointer size-5" />
                            )}
                        </Button>
                    </CardTitle>
                    <Button
                        variant="default"
                        onClick={handleSwitchToEvents}
                        className="flex items-center gap-2"
                    >
                        <HiCursorClick className="size-4" />
                        <span>Switch to Events</span>
                    </Button>
                </CardContent>
            </Card>

            <div className="flex flex-col md:flex-row gap-4 md:items-center">
                <LinkDropdown
                    onChange={handleLinkSelect}
                    value={selectedLink}
                    dontWantAllLinksOption
                />
                <DateRangePicker
                    dateRange={dateRange}
                    setDateRange={setDateRange}
                    placeholder="Select Date"
                />
                <Button
                    onClick={handleAllDates}
                    variant="outline"
                    className="font-normal text-sm"
                    title="Removes date checks, and shows all the analytics available"
                >
                    Clear Selected Dates
                </Button>
            </div>

            {selectedLink && (
                <LinkCardItem
                    link={selectedLink}
                    config={{
                        displayMode: "card",
                        heading: "title",
                        value: "description",
                        showCreatorAvatar: true,
                        showCreatedAt: true,
                        showAnalytics: true,
                    }}
                />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <TotalClicksChart
                    className={"lg:col-span-2"}
                    dateRange={dateRange}
                />
                <MetaCountsCard />
                <LinkAnalyticalCountCard />
            </div>
        </div>
    );
};

export default AnalyticsView;
