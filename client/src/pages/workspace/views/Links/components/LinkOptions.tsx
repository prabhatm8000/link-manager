import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ILink } from "@/redux/reducers/types";
import { SlOptionsVertical } from "react-icons/sl";
import type { DropDownOptionsType } from "../types";

const LinkOptions = ({
    options,
    link,
}: {
    options: DropDownOptionsType[];
    link: ILink;
}) => {
    return (
        <div className="rounded-md">
            <DropdownMenu>
                <DropdownMenuTrigger className="p-1">
                    <SlOptionsVertical className="size-4 opacity-50" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {options?.map((option: DropDownOptionsType) => (
                        <DropdownMenuItem
                            key={option.label}
                            variant={option?.variant || "default"}
                            onClick={() => option.onClick(link)}
                        >
                            {option.icon}
                            {option.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default LinkOptions;
