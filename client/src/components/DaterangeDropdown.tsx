import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoIosArrowDown } from "react-icons/io";
import { IoCalendarOutline } from "react-icons/io5";

export type DaterangeType = "24h" | "7d" | "30d" | "90d" | "1y" | "all";

const keypair: { [key in DaterangeType]: string } = {
    "24h": "Last 24 hours",
    "7d": "Last 7 days",
    "30d": "Last 30 days",
    "90d": "Last 90 days",
    "1y": "Last year",
    all: "All",
};
const DATERANGES: { value: DaterangeType; label: string }[] = [
    { value: "24h", label: "Last 24 hours" },
    { value: "7d", label: "Last 7 days" },
    { value: "30d", label: "Last 30 days" },
    { value: "90d", label: "Last 90 days" },
    { value: "1y", label: "Last year" },
    { value: "all", label: "All" },
];

const DaterangeDropdown = ({
    value,
    onChange,
}: {
    value: DaterangeType;
    onChange: (daterange: DaterangeType) => void;
}) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center justify-center gap-2 font-normal border border-border rounded-md px-3 py-1 bg-background">
                <IoCalendarOutline className="size-4" />
                <span>{keypair[value]}</span>
                <IoIosArrowDown className="ml-2 size-3 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
                {DATERANGES.map((daterange) => (
                    <DropdownMenuItem
                        defaultChecked={daterange.value === value}
                        className={`cursor-pointer w-full ${
                            daterange.value === value
                                ? "bg-muted-foreground/15"
                                : ""
                        }`}
                        onClick={() => onChange(daterange.value)}
                        key={daterange.value}
                    >
                        {daterange.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default DaterangeDropdown;
