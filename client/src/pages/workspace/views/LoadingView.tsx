import { IoIosLink } from "react-icons/io";
import ViewHeader from "../components/ViewHeader";

const LoadingView = () => {
    return (
        <div className="h-full grid grid-cols-1 grid-rows-[auto_1fr]">
            <ViewHeader
                heading="Loading..."
                subHeading="Waiting for the workspace to load..."
            />
            <div className="py-4 h-full flex flex-col items-center justify-center -translate-y-[10%]">
                <IoIosLink
                    size={100}
                    className="animate-pulse ease-in-out"
                />
            </div>
        </div>
    );
};

export default LoadingView;
