import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingCircle from "@/components/ui/LoadingCircle";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { ILink, ILinkState, IWorkspaceState } from "@/redux/reducers/types";
import { AppDispatch } from "@/redux/store";
import { getLinksByWorkspaceId } from "@/redux/thunks/linksThunks";
import { useEffect, useState } from "react";
import { IoIosSearch, IoMdRefresh } from "react-icons/io";
import { IoAdd } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import ViewHeader from "../../components/ViewHeader";
import CreateLinkModal from "./components/CreateLinkModal";
import DeleteLinkModal from "./components/DeleteLinkModal";
import LinkDetailsModal from "./components/LinkDetailsModal";
import LinkItem from "./components/LinkItem";

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
    };
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

            <form className="items-center gap-2 inline-flex w-full mt-5 mb-10">
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
                        <span>Add Link</span>
                    </Button>
                </div>

                {linksState.loading ? (
                    <LoadingCircle className="size-5" />
                ) : linksState.links.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">
                                    Short Link
                                </TableHead>
                                <TableHead>Creator</TableHead>
                                <TableHead>Tags</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {linksState.links.map((link) => (
                                <LinkItem
                                    key={link._id}
                                    link={link}
                                    onDetail={handleDetailBtn}
                                    onEdit={handleEditBtn}
                                    onDelete={handleDeleteBtn}
                                />
                            ))}
                        </TableBody>
                    </Table>
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
