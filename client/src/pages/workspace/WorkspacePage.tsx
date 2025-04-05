import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import type { IWorkspaceState } from "../../redux/reducers/types";
import type { SideBarTabType } from "./components/SideBar";
import AnalyticsView from "./views/Analytics/AnalyticsView";
import EventsView from "./views/Events/EventsView";
import LinksView from "./views/Links/LinksView";
import LoadingView from "./views/Others/LoadingView";
import NoWorkspaceView from "./views/Others/NoWorkspaceView";
import ProfileView from "./views/Profile/ProfileView";
import SettingsView from "./views/Settings/SettingsView";

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
