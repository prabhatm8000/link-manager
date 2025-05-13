"use client";

import ClickCountSpan from "@/components/ClickCountSpan";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { handleNumber } from "@/lib/handleNumber";
import { cn } from "@/lib/utils";
import type { IAnalyticsState } from "@/redux/reducers/types";
import { format } from "date-fns";
import { IoAnalytics } from "react-icons/io5";
import { LuMousePointerClick } from "react-icons/lu";
import { useSelector } from "react-redux";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
    count: {
        label: "Clicks",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig;

function TotalClicksChart({
    className,
    dateRange,
}: {
    className?: string;
    dateRange: { startDate: string; endDate: string };
}) {
    const analyticsState: IAnalyticsState = useSelector(
        (state: any) => state.analytics
    );

    const dateCountObj: any = {};
    if (dateRange.startDate && dateRange.endDate) {
        for (
            let d = new Date(dateRange.startDate);
            d <= new Date(dateRange.endDate);
            d.setDate(d.getDate() + 1)
        ) {
            dateCountObj[format(d, "yyyy-MM-dd")] = 0;
        }

        analyticsState.analytics.metrix?.dateWiseClickCount?.forEach((adc) => {
            dateCountObj[format(new Date(adc.date), "yyyy-MM-dd")] = adc.count;
        });
    }

    const chartData = Object.keys(dateCountObj).map((date) => ({
        date: format(new Date(date), "MMM dd"),
        count: dateCountObj[date],
    }));

    return (
        <div
            className={cn(
                "h-full grid grid-cols-1 xl:grid-cols-[0.8fr_0.2fr] gap-4",
                className
            )}
        >
            <Card>
                <CardHeader>
                    <CardTitle>Clicks</CardTitle>
                    <CardDescription>
                        {dateRange.startDate && dateRange.endDate && chartData.length >= 2
                            ? `Showing clicks from ${format(
                                  dateRange.startDate,
                                  "MMMM dd"
                              )} to ${format(dateRange.endDate, "MMMM dd")}.`
                            : "No Data or Select at least 2 dates to view a chart."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                    {chartData.length >= 2 ? (
                        <ChartContainer
                            className="h-[400px] w-full"
                            config={chartConfig}
                        >
                            <AreaChart
                                accessibilityLayer
                                data={chartData}
                                margin={{
                                    left: 12,
                                    right: 12,
                                    bottom: 12,
                                    top: 12,
                                }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="date"
                                    // tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    tickFormatter={(value) => value}
                                />
                                <ChartTooltip
                                    cursor={false}
                                    content={
                                        <ChartTooltipContent indicator="line" />
                                    }
                                />
                                <Area
                                    dataKey="count"
                                    type="bump"
                                    fillOpacity={0.4}
                                />
                            </AreaChart>
                        </ChartContainer>
                    ) : (
                        <div className="text-muted-foreground h-full w-full flex flex-col items-center justify-center text-sm">
                            <IoAnalytics className="size-8" />
                            <span>No Data</span>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <div className="flex w-full items-start gap-2 text-sm">
                        <div className="grid gap-2">
                            <div className="flex items-center gap-2 font-medium leading-none">
                                {`Total Clicks: `}
                                <ClickCountSpan
                                    count={
                                        analyticsState.analytics?.metrix
                                            ?.totalClicks
                                    }
                                />
                            </div>
                            <div className="flex items-center gap-2 leading-none text-muted-foreground">
                                {`Maximum of ${handleNumber(
                                    analyticsState.analytics?.metrix?.maxClicks
                                        .count
                                )} triggers on ${
                                    analyticsState.analytics?.metrix?.maxClicks
                                        .date
                                        ? format(
                                              analyticsState.analytics?.metrix
                                                  ?.maxClicks.date,
                                              "MMMM dd"
                                          )
                                        : ""
                                } and Minimum (non-zero) of ${handleNumber(
                                    analyticsState.analytics?.metrix?.minClicks
                                        .count
                                )} triggers on ${
                                    analyticsState.analytics?.metrix?.minClicks
                                        .date
                                        ? format(
                                              analyticsState.analytics?.metrix
                                                  ?.minClicks.date,
                                              "MMMM dd"
                                          )
                                        : ""
                                }.`}
                            </div>
                        </div>
                    </div>
                </CardFooter>
            </Card>

            <Card className="hidden xl:block h-full p-0">
                <CardHeader className="p-3">
                    <CardTitle>Clicks</CardTitle>
                    <CardDescription>
                        Showing total clicks in the selected date range.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-1 px-0 h-[500px] overflow-auto border-0">
                    <div className="flex items-center justify-between bg-primary/5 rounded-md py-1 px-3">
                        <div className="text-sm">{"Date"}</div>
                        <span className="text-xs border border-border rounded-md w-fit h-fit px-3 py-1 flex items-center justify-center gap-1">
                            <LuMousePointerClick className="size-4" />
                            Clicks
                        </span>
                    </div>
                    {chartData.map((data) => (
                        <div
                            key={data.date}
                            className="flex items-center justify-between rounded-md py-0.5 px-3 border-t border-primary/10 text-muted-foreground text-xs"
                        >
                            <span>{data.date}</span>
                            <span>{handleNumber(data.count)}</span>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}

export default TotalClicksChart;
