import DaterangeDropdown, {
    type DaterangeType,
} from "@/components/DaterangeDropdown";
import LinkDropdown from "@/components/LinkDropdown";
import { Button } from "@/components/ui/button";
import LoadingCircle from "@/components/ui/LoadingCircle";
import { clearState } from "@/redux/reducers/events";
import type {
    IEventState,
    ILink,
    IWorkspaceState,
} from "@/redux/reducers/types";
import { AppDispatch } from "@/redux/store";
import { getEvents } from "@/redux/thunks/eventsThunks";
import { useCallback, useEffect, useRef, useState } from "react";
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
        handleRefreshEvents();
        setSelectedLink(link);
    };

    const handleDaterangeChange = (value: DaterangeType) => {
        handleRefreshEvents();
        setDaterangeFilter(value);
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
    ]);

    return (
        <>
            <div className="flex gap-2 items-center mt-1 mb-4">
                <LinkDropdown
                    onChange={handleLinkSelect}
                    value={selectedLink}
                />
                <DaterangeDropdown
                    value={daterangeFilter}
                    onChange={handleDaterangeChange}
                />
            </div>
            
            <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center gap-3">
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
                </div>

                {eventsState?.events.length > 0 ? (
                    <EventTable
                        events={eventsState.events}
                        lastRowRef={lastRowRef}
                    />
                ) : (
                    <div className="my-20 flex justify-center items-center h-full">
                        <p className="text-muted-foreground">
                            No events found.
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

export default EventsView;
