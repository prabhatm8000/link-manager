import { GoUnlink } from "react-icons/go";
import ViewHeader from "../components/ViewHeader";

const NoWorkspaceView = () => {
    return (
        <div className="h-full grid grid-cols-1 grid-rows-[auto_1fr]">
            <ViewHeader
                heading="No Workspace"
                subHeading="Create a workspace, goto to profile or click on 'Create one' button in the sidebar."
            />
            <div className="py-4 h-full flex flex-col items-center justify-center -translate-y-[10%]">
                <GoUnlink
                    size={100}
                    className="m-auto text-black/15 dark:text-white/15"
                />
            </div>
        </div>
    );
};

export default NoWorkspaceView;
