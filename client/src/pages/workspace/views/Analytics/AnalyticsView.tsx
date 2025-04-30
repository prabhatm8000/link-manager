import { Button } from "@/components/ui/button";
import LoadingCircle from "@/components/ui/LoadingCircle";
import { HiCursorClick } from "react-icons/hi";
import { IoMdRefresh } from "react-icons/io";
import { useSearchParams } from "react-router-dom";

const AnalyticsView = () => {
    const [_, setSearchQuery] = useSearchParams();

    const handleSwitchToEvents = () => {
        setSearchQuery((prev) => {
            prev.set("tab", "events");
            return prev;
        });
    };
    return (
        <div className="py-4">
            <div className="flex justify-between items-center gap-3">
                <h3 className="text-muted-foreground flex items-center gap-0">
                    <span>Analytics</span>
                    <Button
                        variant={"ghost"}
                        size={"icon"}
                        className="text-foreground"
                        // disabled={eventsState.loading}
                        // onClick={handleRefreshEvents}
                    >
                        {true ? (
                            <LoadingCircle className="size-4" />
                        ) : (
                            <IoMdRefresh className="cursor-pointer size-5" />
                        )}
                    </Button>
                </h3>
                <Button
                    variant="default"
                    onClick={handleSwitchToEvents}
                    className="flex items-center gap-2"
                >
                    <HiCursorClick className="size-4" />
                    <span>Switch to Events</span>
                </Button>
            </div>
        </div>
    );
};

export default AnalyticsView;
