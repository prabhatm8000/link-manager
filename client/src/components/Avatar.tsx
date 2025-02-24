import { useState } from "react";
import getRandomColor from "../lib/getRandomColor";

const sizeMap = {
    xs: [10, 10],
    sm: [16, 16],
    md: [30, 30],
    lg: [45, 45],
    xl: [60, 60],
    "2xl": [90, 90],
};
const fontMap = {
    xs: 6,
    sm: 10,
    md: 18,
    lg: 24,
    xl: 30,
    "2xl": 40,
};

const Avatar = ({
    props,
    title,
    size = "xs",
}: {
    props: React.ComponentPropsWithoutRef<"img">;
    title: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}) => {
    const [isError, setIsError] = useState<boolean>(false);
    const color = getRandomColor({ strength: "500" });
    return (
        <div
            title={title}
            className={`cursor-default w-fit h-fit flex justify-center items-center rounded-full text-white bg-stone-800 dark:text-black dark:bg-stone-200 `}
            style={{
                width: `${sizeMap[size][0]}px`,
                height: `${sizeMap[size][1]}px`,
                // backgroundColor: color,
            }}
        >
            {isError || !props.src ? (
                <span
                    {...props}
                    style={{ fontSize: `${fontMap[size]}px` }}
                    className="p-2"
                >
                    {title.charAt(0).toUpperCase()}
                </span>
            ) : (
                <img
                    {...props}
                    style={{
                        width: `${sizeMap[size][0]}`,
                        height: `${sizeMap[size][1]}`,
                    }}
                    onError={() => setIsError(true)}
                />
            )}
        </div>
    );
};

export default Avatar;
