import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";

function DateRangePicker({
    placeholder,
    dateRange,
    setDateRange,
}: {
    placeholder?: string;
    dateRange: { startDate: string; endDate: string };
    setDateRange: (daterange: { startDate: string; endDate: string }) => void;
}) {
    const [dateArr, setDateArr] = useState<Date[] | undefined>([
        new Date(dateRange.startDate),
        new Date(dateRange.endDate),
    ]);

    const handleDateSelect = (dates?: Date[]) => {
        if (!dates) return;
        if (dates.length === 1) {
            setDateRange({
                startDate: dates[0].toDateString(),
                endDate: "",
            });
            setDateArr([dates[0]]);
        } else {
            dates.sort((a, b) => a.getTime() - b.getTime());
            let firstDate = null,
                lastDate = null;
            if (dates[0] < dates[dates.length - 1]) {
                firstDate = dates[0];
                lastDate = dates[dates.length - 1];
            } else {
                firstDate = dates[dates.length - 1];
                lastDate = dates[0];
            }

            const dateArray: string[] = [];
            let currentDate = firstDate;
            while (currentDate <= lastDate) {
                dateArray.push(currentDate.toDateString());
                currentDate = new Date(
                    currentDate.setDate(currentDate.getDate() + 1)
                );
            }

            setDateArr(dateArray.map((date) => new Date(date)));
        }
    };

    useEffect(() => {
        if (!dateArr || !dateArr?.length) return;
        setDateRange({
            startDate: dateArr[0].toDateString(),
            endDate: dateArr[dateArr.length - 1].toDateString(),
        });
    }, [dateArr]);

    useEffect(() => {
        if (!dateRange.startDate && !dateRange.endDate) {
            setDateArr([]);
        }
    }, [dateRange]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full md:w-fit text-left font-normal",
                        !dateArr && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon />
                    <span>
                        {dateRange.startDate || dateRange.endDate
                            ? `${
                                  dateRange.startDate
                                      ? format(dateRange.startDate, "PPP")
                                      : placeholder
                              } - ${
                                  dateRange.endDate
                                      ? format(dateRange.endDate, "PPP")
                                      : placeholder
                              }`
                            : `${placeholder} - ${placeholder}`}
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar
                    mode="multiple"
                    selected={dateArr}
                    onSelect={handleDateSelect}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
}

export default DateRangePicker;
