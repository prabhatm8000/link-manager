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
import { Button } from "./ui/button";

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
            <DropdownMenuTrigger>
                <Button
                    title="Select Link"
                    variant="outline"
                    className="w-full flex items-center gap-2 font-normal"
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
                    <span>{value?.shortUrlKey || "Select Link"}</span>
                    <IoIosArrowDown className="ml-2 size-3 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full max-h-80">
                {!dontWantAllLinksOption && (
                    <DropdownMenuItem onClick={() => onChange(undefined)}>
                        <Avatar>
                            <IoIosLink className="size-4" />
                        </Avatar>
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
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default LinkDropdown;
