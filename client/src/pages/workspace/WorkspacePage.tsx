import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import type { IWorkspaceState } from "../../redux/reducers/types";
import type { SideBarTabType } from "./components/SideBar";
import ViewHeader from "./components/ViewHeader";
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
    
    let page: {
        heading: string;
        subHeading: string;
        viewNode: React.ReactNode;
    } | null = null;
    switch (searchParams.get("tab") as SideBarTabType) {
        case "profile":
            page = {
                heading: "Profile",
                subHeading: "Manage your profile",
                viewNode: <ProfileView />,
            };
            break;
        case "events":
            page = {
                heading: "Events",
                subHeading: "Manage your events",
                viewNode: <EventsView />,
            };
            break;
        case "analytics":
            page = {
                heading: "Analytics",
                subHeading: "Manage your analytics",
                viewNode: <AnalyticsView />,
            };
            break;
        case "settings":
            page = {
                heading: "Settings",
                subHeading: "Manage your workspace settings",
                viewNode: <SettingsView />,
            };
            break;
        case "links":
        default:
            page = {
                heading: "Links",
                subHeading: "Manage your links",
                viewNode: <LinksView />,
            };
            break;
    }

    return (
        <>
            <ViewHeader heading={page.heading} subHeading={page.subHeading} />
            {page.viewNode}
        </>
    );
};

export default WorkspacePage;
