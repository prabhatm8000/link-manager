import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingCircle from "../../../components/ui/LoadingCircle";
import type {
    ILinkState,
    IWorkspaceState,
} from "../../../redux/reducers/types";
import type { AppDispatch } from "../../../redux/store";
import { getLinksByWorkspaceId } from "../../../redux/thunks/linksThunks";
import CreateLinkBtnWithModal from "../components/CreateLinkBtnWithModal";
import LinkItem from "../components/LinkItem";
import ViewHeader from "../components/ViewHeader";

const LinksView = () => {
    const linksState: ILinkState = useSelector((state: any) => state.links);
    const dispatch = useDispatch<AppDispatch>();
    const workspaceState: IWorkspaceState = useSelector(
        (state: any) => state.workspace
    );

    useEffect(() => {
        if (workspaceState.currentWorkspace) {
            dispatch(
                getLinksByWorkspaceId(
                    workspaceState.currentWorkspace._id as string
                )
            );
        }
    }, [workspaceState.currentWorkspace]);

    return (
        <>
            <ViewHeader heading="Links" subHeading="Manage your links" />
            <div className="py-4">
                <CreateLinkBtnWithModal />
                {linksState.loading && <LoadingCircle className="size-5" />}
                {linksState.links.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {linksState.links.map((link) => (
                            <LinkItem key={link._id} link={link} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default LinksView;
