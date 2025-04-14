import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import type { ILink } from "@/redux/reducers/types";
import { SlOptionsVertical } from "react-icons/sl";
import type { DropDownOptionsType } from "../types";

const LinkItem = ({
    link,
    options,
}: {
    link: ILink;
    options?: DropDownOptionsType[];
}) => {
    return (
        <TableRow>
            <TableCell>
                <a
                    href={`${link.shortUrl}`}
                    target="_blank"
                    className="text-blue-400"
                >
                    /{link.shortUrlKey}
                </a>
            </TableCell>

            <TableCell
                title={link?.creator?.name}
            >
                <div className="flex items-center gap-2">
                    <Avatar>
                        <AvatarImage
                            src={link?.creator?.profilePicture}
                            alt={link?.creator?.name}
                        />
                        <AvatarFallback>
                            {link?.creator?.name?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <span>{link?.creator?.email}</span>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex flex-wrap gap-2 min-w-52">
                    {link?.tags?.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="inline-block bg-muted-foreground/20 text-foreground rounded-full px-3 py-1 text-xs font-semibold"
                        >
                            {tag}
                        </span>
                    ))}
                    {link?.tags?.length && link?.tags?.length > 3 ? (
                        <span>...</span>
                    ): "-"}
                </div>
            </TableCell>
            <TableCell>
                <span
                    className={`${
                        link?.status === "active" ? "bg-green-500" : "bg-red-500"
                    } rounded-full px-3 py-1 text-xs font-semibold mr-2 text-white`}
                >
                    {link?.status.charAt(0).toUpperCase() + link?.status.slice(1)}
                </span>
            </TableCell>
            <TableCell className="text-right">
                <div className="rounded-md w-full h-full">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="p-1">
                            <SlOptionsVertical className="size-4 opacity-50" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
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
            </TableCell>
        </TableRow>
    );
};

export default LinkItem;
