import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingCircle from "@/components/ui/LoadingCircle";
import type {
    ILink,
    ILinkState,
    IWorkspaceState,
} from "@/redux/reducers/types";
import { AppDispatch } from "@/redux/store";
import { getLinksByWorkspaceId } from "@/redux/thunks/linksThunks";
import { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { IoIosSearch, IoMdLink, IoMdRefresh } from "react-icons/io";
import { IoAdd } from "react-icons/io5";
import { TbEdit } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import ViewHeader from "../../components/ViewHeader";
import CreateLinkModal from "./components/CreateLinkModal";
import DeleteLinkModal from "./components/DeleteLinkModal";
import LinkDetailsModal from "./components/LinkDetailsModal";
import LinkTable from "./components/LinkTable";
import type { DropDownOptionsType } from "./types";

type WhichModalType = {
    createLink: boolean;
    detailsLink: boolean;
    deleteLink: boolean;
};

const LinksView = () => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [refreshLinks, setRefreshLinks] = useState<boolean>(false);
    const [selectedLink, setSelectedLink] = useState<ILink | null>(null);
    const [showModals, setShowModals] = useState<WhichModalType>({
        createLink: false,
        detailsLink: false,
        deleteLink: false,
    });

    const dispatch = useDispatch<AppDispatch>();
    const linksState: ILinkState = useSelector((state: any) => state.links);
    const workspaceState: IWorkspaceState = useSelector(
        (state: any) => state.workspace
    );

    const handleSearchQueryChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const val = e.target.value;
        setSearchQuery(val);
        if (val.length < 3) return;
        setRefreshLinks(true); // trigger refresh [useEffect]
    };

    const handleModalState = (
        modalKey: keyof WhichModalType,
        state?: boolean
    ) => {
        setShowModals((p) => {
            return { ...p, [modalKey]: state || !p[modalKey] };
        });
        if (!state) setSelectedLink(null);
    };

    // #region modal handlers
    const handleDetailBtn = (link: ILink) => {
        setSelectedLink(link);
        handleModalState("detailsLink", true);
    };
    const handleEditBtn = (link: ILink) => {
        setSelectedLink(link);
        handleModalState("createLink", true);
    };
    const handleDeleteBtn = (link: ILink) => {
        setSelectedLink(link);
        handleModalState("deleteLink", true);
    };
    // #region link options
    const linkOptions: DropDownOptionsType[] = [
        {
            label: "Details",
            icon: <IoMdLink />,
            onClick: handleDetailBtn,
        },
        {
            label: "Edit",
            icon: <TbEdit />,
            onClick: handleEditBtn,
        },
        {
            label: "Delete",
            icon: <AiOutlineDelete />,
            variant: "destructive",
            onClick: handleDeleteBtn,
        },
    ];

    useEffect(() => {
        // debounce
        const timeoutId = setTimeout(() => {
            if (
                !workspaceState.currentWorkspace ||
                (linksState.links.length > 0 && !refreshLinks)
            ) {
                return;
            }
            dispatch(
                getLinksByWorkspaceId({
                    workspaceId: workspaceState.currentWorkspace._id as string,
                    q: searchQuery,
                })
            ).then(() => setRefreshLinks(false));
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [workspaceState.currentWorkspace, refreshLinks, searchQuery]);

    return (
        <>
            <ViewHeader heading="Links" subHeading="Manage your links" />

            <div className="flex flex-col md:flex-row gap-2 items-start md:items-center justify-between mt-1 mb-4">
                <span></span>
                {/* <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="outline">
                            <LuSettings2 className="size-5" />
                            <span>Display</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="ms-4">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Profile</DropdownMenuItem>
                        <DropdownMenuItem>Billing</DropdownMenuItem>
                        <DropdownMenuItem>Team</DropdownMenuItem>
                        <DropdownMenuItem>Subscription</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu> */}
                <form
                    className="items-center gap-2 inline-flex max-w-sm w-full"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSearchQueryChange({
                            target: { value: searchQuery },
                        } as any);
                    }}
                >
                    <Input
                        id="search-link-view"
                        type="text"
                        placeholder="Search with tags or creator email or short url, at least 3 characters"
                        className="w-full"
                        value={searchQuery}
                        onChange={handleSearchQueryChange}
                    />
                    <Button type="submit" className="inline-flex items-center">
                        <IoIosSearch className="size-5" />
                        <span>Search</span>
                    </Button>
                </form>
            </div>

            <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center gap-3">
                    <h3 className="text-muted-foreground flex items-center gap-0">
                        <span>Links</span>
                        <Button
                            variant={"ghost"}
                            size={"icon"}
                            className="text-foreground"
                            disabled={linksState.loading || refreshLinks}
                            onClick={() => setRefreshLinks(true)}
                        >
                            <IoMdRefresh className="cursor-pointer size-5" />
                        </Button>
                    </h3>
                    <Button
                        variant="default"
                        className="flex items-center gap-2"
                        onClick={() =>
                            setShowModals((p) => ({ ...p, createLink: true }))
                        }
                    >
                        <IoAdd />
                        <span>Create Link</span>
                    </Button>
                </div>

                {linksState.loading ? (
                    <LoadingCircle className="size-5" />
                ) : linksState.links.length > 0 ? (
                    <LinkTable links={linksState.links} options={linkOptions} />
                ) : null}
            </div>

            <CreateLinkModal
                isOpen={showModals.createLink}
                onClose={() => handleModalState("createLink")}
            />
            {selectedLink && (
                <>
                    <LinkDetailsModal
                        isOpen={showModals.detailsLink}
                        onClose={() => handleModalState("detailsLink")}
                        linkId={selectedLink._id}
                        onOpenDelete={handleDeleteBtn}
                        onOpenEdit={handleEditBtn}
                    />
                    <DeleteLinkModal
                        isOpen={showModals.deleteLink}
                        onClose={() => handleModalState("deleteLink")}
                        link={selectedLink}
                    />
                    {/* for edit */}
                    <CreateLinkModal
                        isOpen={showModals.createLink}
                        onClose={() => handleModalState("createLink")}
                        editMode={true}
                        formDataForEdit={selectedLink}
                    />
                </>
            )}
        </>
    );
};

export default LinksView;
