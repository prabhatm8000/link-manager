import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type {
    ILink,
    ILinkState,
    IWorkspaceState,
} from "@/redux/reducers/types";
import type { AppDispatch } from "@/redux/store";
import { getLinksByWorkspaceId } from "@/redux/thunks/linksThunks";
import { useEffect } from "react";
import { IoIosArrowDown, IoIosLink } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const LinkDropdown = ({
    value,
    onChange,
    dontWantAllLinksOption = false,
}: {
    value?: ILink;
    onChange: (link?: ILink) => void;
    dontWantAllLinksOption?: boolean;
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const linksState: ILinkState = useSelector((state: any) => state.links);
    const workspaceState: IWorkspaceState = useSelector(
        (state: any) => state.workspace
    );

    useEffect(() => {
        // debounce
        const timeoutId = setTimeout(() => {
            if (
                !workspaceState.currentWorkspace ||
                linksState.links.length > 0
            ) {
                return;
            }
            dispatch(
                getLinksByWorkspaceId({
                    workspaceId: workspaceState.currentWorkspace._id as string,
                    q: "",
                })
            );
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [workspaceState.currentWorkspace]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger
                title="Select Link"
                className="flex items-center justify-center gap-2 font-normal border border-border rounded-md px-2 bg-background"
            >
                {value?.shortUrlKey ? (
                    <Avatar>
                        <AvatarImage
                            src={value?.metadata?.favicon}
                            alt={value?.metadata?.title}
                        />
                        <AvatarFallback itemType="link" />
                    </Avatar>
                ) : (
                    <IoIosLink className="size-4" />
                )}
                <span className="py-1">{value?.shortUrlKey || "Select Link"}</span>
                <IoIosArrowDown className="ml-2 size-3 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full max-h-80">
                {!dontWantAllLinksOption && (
                    <DropdownMenuItem
                        className="cursor-pointer w-full"
                        onClick={() => onChange(undefined)}
                    >
                        <IoIosLink className="size-4 mx-2.5" />
                        <span>{"All Link"}</span>
                    </DropdownMenuItem>
                )}
                {linksState?.links.map((l, i) => (
                    <DropdownMenuItem
                        defaultChecked={l._id === value?._id}
                        className={`cursor-pointer w-full ${
                            l._id === value?._id ? "bg-muted-foreground/15" : ""
                        }`}
                        onClick={() => onChange(l)}
                        key={i}
                        title={l.destinationUrl}
                    >
                        <Avatar>
                            <AvatarImage
                                src={l?.metadata?.favicon}
                                alt={l?.metadata?.title}
                            />
                            <AvatarFallback itemType="link" />
                        </Avatar>
                        <span>/{l.shortUrlKey}</span>
                    </DropdownMenuItem>
                ))}

                {linksState.links.length === 0 && (
                    <DropdownMenuItem
                        className="cursor-pointer w-full"
                        title="No links found"
                    >
                        <IoIosLink className="size-4" />
                        <span>No links found</span>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default LinkDropdown;
