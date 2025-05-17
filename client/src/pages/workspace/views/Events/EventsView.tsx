import DaterangeDropdown, {
    type DaterangeType,
} from "@/components/DaterangeDropdown";
import LinkDropdown from "@/components/LinkDropdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import LoadingCircle from "@/components/ui/LoadingCircle";
import { convertToCSV, getTheCSVBlob } from "@/lib/dataToCsv";
import { clearState } from "@/redux/reducers/events";
import type {
    IEventState,
    ILink,
    IWorkspaceState,
} from "@/redux/reducers/types";
import { AppDispatch } from "@/redux/store";
import { getEvents } from "@/redux/thunks/eventsThunks";
import { format } from "date-fns/format";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { IoMdRefresh } from "react-icons/io";
import { IoAnalytics } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import EventTable from "./components/EventTable";

const EventsView = () => {
    const workspaceState: IWorkspaceState = useSelector(
        (state: any) => state.workspace
    );
    const eventsState: IEventState = useSelector((state: any) => state.events);
    const dispatch = useDispatch<AppDispatch>();
    const [_, setSearchQuery] = useSearchParams();
    const [skip, setSkip] = useState<number>(0);
    const [limit, __] = useState<number>(15);
    const [daterangeFilter, setDaterangeFilter] =
        useState<DaterangeType>("24h");
    const [selectedLink, setSelectedLink] = useState<ILink>();

    const handleSwitchToAnalytics = () => {
        setSearchQuery((prev) => {
            prev.set("tab", "analytics");
            return prev;
        });
    };

    const handleRefreshEvents = () => {
        dispatch(clearState());
        setSkip(0);
    };

    const handleLinkSelect = (link?: ILink) => {
        setSelectedLink((p) => {
            if (p?._id === link?._id) return link;
            handleRefreshEvents();
            return link;
        });
    };

    const handleDaterangeChange = (value: DaterangeType) => {
        handleRefreshEvents();
        setDaterangeFilter(value);
    };

    const handleCSVDownload = () => {
        const data = eventsState.events?.map((event) => {
            return {
                "Short Url": `${window.location.origin}/${event.link.shortUrlKey}`,
                Destination: event.link.destinationUrl,
                Trigger: event.trigger,
                Browser: event.metadata.browser,
                Device: event.metadata.device,
                OS: event.metadata.os,
                Country: event.metadata.country,
                Region: event.metadata.region,
                City: event.metadata.city,
                "Date & Time": `${format(
                    new Date(event.createdAt),
                    "MMM dd"
                )} · ${format(new Date(event.createdAt), "hh:mm:ss a")}`,
            };
        });

        const csvString = convertToCSV(data);
        const blob = getTheCSVBlob(csvString);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `events-${daterangeFilter}-${format(new Date(), "yyyy-MM-dd_hh:mm:ss")}.csv`;
        a.click();
    };

    const rowObserver = useRef<IntersectionObserver | null>(null);

    const lastRowRef = useCallback(
        (element: HTMLDivElement | null) => {
            if (eventsState.loading || !eventsState.hasMore) return;

            if (rowObserver.current) rowObserver.current.disconnect();

            rowObserver.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    setSkip((prev) => {
                        return prev + limit;
                    });
                }
            });

            if (element) rowObserver.current?.observe(element);
        },
        [eventsState.loading, limit]
    );

    useEffect(() => {
        if (!workspaceState?.currentWorkspace?._id || !eventsState.hasMore) {
            return;
        }
        dispatch(
            getEvents({
                workspaceId: workspaceState.currentWorkspace._id,
                linkId: selectedLink?._id,
                skip,
                limit,
                daterange: daterangeFilter,
            })
        );
    }, [
        workspaceState.currentWorkspace,
        dispatch,
        skip,
        limit,
        daterangeFilter,
        selectedLink,
        eventsState.hasMore,
    ]);

    return (
        <>
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between w-full mt-1 mb-4">
                <div className="flex gap-4 items-center">
                    <LinkDropdown
                        onChange={handleLinkSelect}
                        value={selectedLink}
                    />
                    <DaterangeDropdown
                        value={daterangeFilter}
                        onChange={handleDaterangeChange}
                    />
                </div>
                <Button onClick={handleCSVDownload} className="w-full" variant={"outline"}>
                    <FiDownload />
                    <span>Download as CSV</span>
                </Button>
            </div>

            <div className="pb-4">
                <Card className="py-4">
                    <CardHeader className="px-4 flex justify-between items-center gap-3">
                        <h3 className="text-muted-foreground flex items-center gap-0">
                            <span>Events</span>
                            <Button
                                variant={"ghost"}
                                size={"icon"}
                                className="text-foreground"
                                disabled={eventsState.loading}
                                onClick={handleRefreshEvents}
                            >
                                {eventsState.loading ? (
                                    <LoadingCircle className="size-4" />
                                ) : (
                                    <IoMdRefresh className="cursor-pointer size-5" />
                                )}
                            </Button>
                        </h3>
                        <Button
                            variant="default"
                            onClick={handleSwitchToAnalytics}
                            className="flex items-center gap-2"
                        >
                            <IoAnalytics className="size-5" />
                            <span>Switch to Analytics</span>
                        </Button>
                    </CardHeader>
                    <CardContent className="px-4">
                        <EventTable
                            events={eventsState.events}
                            lastRowRef={lastRowRef}
                        />
                        <div className="py-2 text-muted-foreground w-full text-center flex justify-center">
                            {eventsState.loading && (
                                <LoadingCircle className="size-4" />
                            )}
                            {!eventsState.loading &&
                                eventsState.events.length === 0 && (
                                    <>No events</>
                                )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default EventsView;
