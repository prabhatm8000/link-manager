import { useSearchParams } from "react-router-dom";
import type { SideBarTabType } from "./components/SideBar";
import ProfileView from "./views/ProfileView";
import LinksView from "./views/LinksView";
import EventsView from "./views/EventsView";
import AnalyticsView from "./views/AnalyticsView";
import SettingsView from "./views/SettingsView";
import NoWorkspaceView from "./views/NoWorkspaceView";
import type { IWorkspaceState } from "../../redux/reducers/types";
import { useSelector } from "react-redux";
import LoadingView from "./views/LoadingView";

const WorkspacePage = () => {
    const [searchParams, _] = useSearchParams();
    const workspaceState: IWorkspaceState = useSelector(
        (state: any) => state.workspace
    );

    if (
        !searchParams.get("workspaceId") &&
        searchParams.get("tab") != "profile"
    ) {
        if (workspaceState.loading) return <LoadingView />;
        return <NoWorkspaceView />;
    }
    switch (searchParams.get("tab") as SideBarTabType) {
        case "profile":
            return <ProfileView />;
        case "links":
            return <LinksView />;
        case "events":
            return <EventsView />;
        case "analytics":
            return <AnalyticsView />;
        case "settings":
            return <SettingsView />;
        default:
            return <LinksView />;
    }
};

export default WorkspacePage;
