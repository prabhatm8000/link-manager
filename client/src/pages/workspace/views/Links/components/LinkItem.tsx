import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import type { ILink } from "@/redux/reducers/types";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdLink } from "react-icons/io";
import { SlOptionsVertical } from "react-icons/sl";
import { TbEdit } from "react-icons/tb";

const LinkItem = ({
    link,
    onDetail,
    onEdit,
    onDelete,
}: {
    link: ILink;
    onDetail: (link: ILink) => void;
    onEdit: (link: ILink) => void;
    onDelete: (link: ILink) => void;
}) => {
    return (
        <TableRow>
            <TableCell>
                <a
                    href={`${link.shortUrl}`}
                    target="_blank"
                    className="text-blue-400"
                >
                    {`/${link.shortUrlKey}`}
                </a>
            </TableCell>

            <TableCell
                title={link?.creator?.name}
                onClick={() => onDetail(link)}
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
            <TableCell onClick={() => onDetail(link)}>
                <div className="flex flex-wrap gap-2 min-w-52">
                    {link?.tags?.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="inline-block bg-muted-foreground/20 text-foreground rounded-full px-3 py-1 text-xs font-semibold"
                        >
                            {tag}
                        </span>
                    ))}
                    {link?.tags?.length && link?.tags?.length > 3 && (
                        <span>...</span>
                    )}
                </div>
            </TableCell>
            <TableCell>
                <span
                    className={`${
                        link?.isActive ? "bg-green-500" : "bg-red-500"
                    } rounded-full px-3 py-1 text-xs font-semibold mr-2`}
                >
                    {link?.isActive ? "Active" : "Inactive"}
                </span>
            </TableCell>
            <TableCell className="text-right">
                <div className="rounded-md w-full h-full">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="p-1">
                            <SlOptionsVertical className="size-4 opacity-50" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                onClick={() => onDetail(link)}
                                variant={"default"}
                                className="flex gap-2 items-center justify-start w-full hover:bg-foreground/10 dark:hover:bg-foreground/10"
                            >
                                <IoMdLink />
                                <span>{"Details"}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => onEdit(link)}
                                variant={"default"}
                                className="flex gap-2 items-center justify-start w-full hover:bg-foreground/10 dark:hover:bg-foreground/10"
                            >
                                <TbEdit />
                                <span>{"Edit"}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="flex gap-2 items-center justify-start w-full hover:bg-red-200 dark:hover:bg-red-950"
                                variant="destructive"
                                onClick={() => onDelete(link)}
                            >
                                <AiOutlineDelete className="text-red-500" />
                                <span>{"Delete"}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </TableCell>
        </TableRow>
    );
};

export default LinkItem;
