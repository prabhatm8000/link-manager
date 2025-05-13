import { Button } from "@/components/ui/button";
import LoadingCircle from "@/components/ui/LoadingCircle";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import type {
    IUsageState,
    IWorkspaceState,
    UsageParameterType,
} from "@/redux/reducers/types";
import type { AppDispatch } from "@/redux/store";
import { getUsage } from "@/redux/thunks/usageThunks";
import { useEffect, useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { HiCursorClick } from "react-icons/hi";
import { IoIosLink, IoMdRefresh } from "react-icons/io";
import { MdWorkspacesOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { handleNumber } from "../../../lib/handleNumber";

export const UsageTooltip = () => {
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    const usageState: IUsageState = useSelector((state: any) => state.usage);
    const quota = usageState.usage.quota;
    const tooltipContentRender = (e: keyof typeof quota) => {
        const q = quota[e];
        return (
            <span>
                <span className="font-semibold">{handleNumber(q.total)}</span>{" "}
                {e} per {q.per}
            </span>
        );
    };

    useEffect(() => {
        if (!isTooltipOpen) return;

        const t = setTimeout(() => {
            setIsTooltipOpen(false);
        }, 5000);
        return () => {
            clearTimeout(t);
        };
    }, [isTooltipOpen]);

    return (
        <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
            <TooltipTrigger>
                <AiOutlineInfoCircle
                    onClick={() => setIsTooltipOpen((p) => !p)}
                    className="size-4 text-muted-foreground"
                />
            </TooltipTrigger>
            <TooltipContent updatePositionStrategy="optimized" className="w-48 mx-4">
                <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                        <span>Subscription:</span>
                        <span className="font-semibold capitalize">
                            {usageState.usage.subscriptionTier}
                        </span>
                    </div>
                    {tooltipContentRender("events")}
                    {tooltipContentRender("links")}
                    {tooltipContentRender("workspaces")}
                </div>
            </TooltipContent>
        </Tooltip>
    );
};

const ProgressBar = ({
    data,
    icon,
}: {
    data: UsageParameterType;
    icon?: React.ReactNode;
}) => {
    const [used, setUsed] = useState(0);
    useEffect(() => {
        const intervalId = setInterval(() => {
            setUsed((p) => {
                if (p >= data.used) {
                    return data.used;
                }
                return Number((p + data.used * 0.2).toPrecision(2));
            });
        }, 150);
        const timeoutId = setTimeout(() => {
            clearInterval(intervalId);
        }, 900);

        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        };
    }, [data.used]);
    return (
        <div
            className="flex flex-col gap-1"
            title={`${data.used} of ${data.total} per ${data.per}`}
        >
            <div className="flex justify-between">
                <div className="flex datas-center gap-1">
                    {icon}
                    <span className="">{data.label}</span>
                </div>
                <span className="">
                    {handleNumber(used)} of {handleNumber(data.total)}
                </span>
            </div>
            <div className="w-full h-1 bg-black/20 dark:bg-white/20 rounded-full">
                <div
                    className={`h-full transition-all duration-300 ease-out ${
                        (used / data.total) * 10 > 9
                            ? "bg-destructive/70"
                            : "bg-foreground"
                    } rounded-full`}
                    style={{
                        width: `${(used / data.total) * 100}%`,
                        // backgroundColor: (used / data.total) * 100 > 90 ? "var(--destructive)" : "",
                    }}
                ></div>
            </div>
        </div>
    );
};

const SideBarUsageBars = () => {
    const { currentWorkspace }: IWorkspaceState = useSelector(
        (state: any) => state.workspace
    );
    const usageState: IUsageState = useSelector((state: any) => state.usage);
    const quota = usageState.usage.quota;
    const [refresh, setRefresh] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        if (!currentWorkspace?._id) return;

        dispatch(getUsage(currentWorkspace._id));
    }, [currentWorkspace?._id, refresh, dispatch]);
    return (
        <div className="w-full py-4">
            <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                    <h5 className="text-muted-foreground text-sm">Usage</h5>
                    <UsageTooltip />
                </div>
                <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="text-foreground"
                    disabled={usageState.loading}
                    onClick={() => setRefresh(!refresh)}
                >
                    {usageState.loading ? (
                        <LoadingCircle className="size-4" />
                    ) : (
                        <IoMdRefresh className="cursor-pointer size-5" />
                    )}
                </Button>
            </div>
            <div className="flex flex-col gap-4 text-sm">
                <ProgressBar data={quota.events} icon={<HiCursorClick />} />
                <ProgressBar data={quota.links} icon={<IoIosLink />} />
                <ProgressBar
                    data={quota.workspaces}
                    icon={<MdWorkspacesOutline />}
                />
            </div>
        </div>
    );
};

export default SideBarUsageBars;
