import { HiCursorClick } from "react-icons/hi";
import { IoIosLink } from "react-icons/io";
import { MdWorkspacesOutline } from "react-icons/md";
import { handleNumber } from "../../../lib/handleNumber";
import CommingSoon from "../../../components/ui/CommingSoon";

type UsageParameterType = { label: string; count: number; total: number };
interface IUsageBarProps {
    data: UsageParameterType[];
}

const SideBarUsageBars = ({ data }: IUsageBarProps) => {
    return (
        <div className="w-full py-4">
            <CommingSoon />
            <h5 className="text-black/50 dark:text-white/50 py-2">Usage</h5>
            <div className="flex flex-col gap-4 text-sm">
                {data.map((item, index) => (
                    <div key={index} className="flex flex-col gap-1">
                        <div key={index} className="flex justify-between">
                            <div className="flex items-center gap-1">
                                {item.label === "Events" && <HiCursorClick />}
                                {item.label === "Links" && <IoIosLink />}
                                {item.label === "Workspaces" && (
                                    <MdWorkspacesOutline />
                                )}
                                <span className="">{item.label}</span>
                            </div>
                            <span className="">
                                {handleNumber(item.count)} of{" "}
                                {handleNumber(item.total)}
                            </span>
                        </div>
                        <div className="w-full h-1 bg-black/20 dark:bg-white/20 rounded-full">
                            <div
                                className="h-full bg-black dark:bg-white rounded-full"
                                style={{
                                    width: `${
                                        (item.count / item.total) * 100
                                    }%`,
                                }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SideBarUsageBars;
