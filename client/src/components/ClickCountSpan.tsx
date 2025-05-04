import { handleNumber } from "@/lib/handleNumber";
import { LuMousePointerClick } from "react-icons/lu";

const ClickCountSpan = ({ count }: { count?: number }) => {
    return (
        <span className="text-xs border border-border rounded-md w-fit h-fit px-2 py-1 flex items-center justify-center gap-1">
            <LuMousePointerClick className="size-4 text-blue-500" />
            {`${handleNumber(count || 0)} clicks`}
        </span>
    );
};

export default ClickCountSpan;
