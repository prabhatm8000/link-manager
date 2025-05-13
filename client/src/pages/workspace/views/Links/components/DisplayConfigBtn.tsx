import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { LinkDisplayConfig } from "@/redux/reducers/types";
import { LuSettings2 } from "react-icons/lu";
import { PiCardsThreeLight, PiTable } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const DisplayConfigBtn = ({
    config,
    handleChange,
}: {
    config: LinkDisplayConfig;
    handleChange: (key: keyof LinkDisplayConfig, value: any) => void;
}) => {
    const displayOptions: {
        label: string;
        disableCondition: boolean;
        key: keyof LinkDisplayConfig;
        value: any;
    }[] = [
        {
            label: "Title",
            disableCondition:
                config.displayMode !== "card" || config.heading !== "title",
            key: "heading",
            value: "title",
        },
        {
            label: "Short URL",
            disableCondition:
                config.displayMode !== "card" || config.heading !== "shortUrl",
            key: "heading",
            value: "shortUrl",
        },
        {
            label: "Description",
            disableCondition:
                config.displayMode !== "card" || config.value !== "description",
            key: "value",
            value: "description",
        },
        {
            label: "Destination URL",
            disableCondition:
                config.displayMode !== "card" ||
                config.value !== "destinationUrl",
            key: "value",
            value: "destinationUrl",
        },
        {
            label: "Analytics",
            disableCondition:
                config.displayMode !== "card" ||
                !config.showAnalytics,
            key: "showAnalytics",
            value: !!config.showAnalytics,
        },
        {
            label: "Creator",
            disableCondition:
                config.displayMode !== "card" || !config.showCreatorAvatar,
            key: "showCreatorAvatar",
            value: !!config.showCreatorAvatar,
        },
        {
            label: "Created At",
            disableCondition:
                config.displayMode !== "card" || !config.showCreatedAt,
            key: "showCreatedAt",
            value: !!config.showCreatedAt,
        },
        {
            label: "Tags",
            disableCondition: config.displayMode !== "card" || !config.showTags,
            key: "showTags",
            value: !!config.showTags,
        },
    ];
    const itemBtnClassName =
        "w-full flex gap-1 items-center justify-center border border-border cursor-pointer px-2 py-1 rounded-md";
    const navigate = useNavigate();
    const handleReset = () => {
        localStorage.removeItem("linkDisplayConfig");
        toast.success("Display config reset");
        navigate(0);
    };
    const handleSave = () => {
        localStorage.setItem("linkDisplayConfig", JSON.stringify(config));
        toast.success("Display config saved");
    };
    const handleOptionClick = (item: (typeof displayOptions)[0]) => {
        handleChange(
            item.key,
            typeof item.value === "boolean" ? !item.value : item.value
        );
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    <LuSettings2 className="size-4" />
                    <span>Display</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="start"
                className="relative px-2 min-w-56 max-w-56"
            >
                <div className="flex items-center justify-between gap-2 text-sm my-2">
                    <span
                        onClick={() => handleChange("displayMode", "card")}
                        className={`${itemBtnClassName} ${
                            config.displayMode === "card"
                                ? `bg-muted-foreground/15`
                                : ""
                        }`}
                    >
                        <PiCardsThreeLight className="size-5" />
                        <span>Card</span>
                    </span>
                    <span
                        onClick={() => handleChange("displayMode", "table")}
                        className={`${itemBtnClassName} ${
                            config.displayMode === "table"
                                ? `bg-muted-foreground/15`
                                : ""
                        }`}
                    >
                        <PiTable className="size-5" />
                        <span>Table</span>
                    </span>
                </div>
                <DropdownMenuSeparator />
                <div className="flex flex-wrap gap-2 items-center text-xs my-2">
                    {displayOptions.map((item, index) => (
                        <span
                            key={index}
                            onClick={() => handleOptionClick(item)}
                            className={`border border-border cursor-pointer px-1 py-0 rounded ${
                                config[item.key] === item.value
                                    ? `bg-muted-foreground/15`
                                    : ""
                            } ${item.disableCondition ? "opacity-50" : ""}`}
                        >
                            {item.label}
                        </span>
                    ))}
                </div>
                <DropdownMenuSeparator />
                <div className="flex items-center justify-between gap-2 w-full my-2 text-xs">
                    <span
                        onClick={handleReset}
                        className={`${itemBtnClassName} hover:bg-destructive/15 bg-destructive/10 text-destructive`}
                    >
                        <span>Reset</span>
                    </span>
                    <span
                        onClick={handleSave}
                        className={`${itemBtnClassName} hover:bg-foreground/10 bg-foreground/5`}
                    >
                        <span>Save</span>
                    </span>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default DisplayConfigBtn;
