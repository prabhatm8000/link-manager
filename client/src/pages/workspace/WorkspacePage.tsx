import { useSearchParams } from "react-router-dom";
import type { SideBarTabType } from "./components/SideBar";
import ProfileView from "./views/ProfileView";
import LinksView from "./views/LinksView";
import EventsView from "./views/EventsView";
import AnalyticsView from "./views/AnalyticsView";
import SettingsView from "./views/SettingsView";
import NoWorkspace from "./views/NoWorkspace";

const WorkspacePage = () => {
    const [searchParams, _] = useSearchParams();
    if (!searchParams.get("workspaceId") && searchParams.get("tab") != "profile") return <NoWorkspace />;

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
