import type React from "react";
import { handleRoundness } from "./classUtity";

interface CardProps extends React.ComponentPropsWithoutRef<"div"> {
    variant?:
        | "primary"
        | "outline"
        | "secondary"
        | "danger"
        | "danger-outline"
        | "none";
    roundness?: "full" | "light" | "";
    children?: React.ReactNode;
}

const handleVariant = (variant: CardProps["variant"]) => {
    switch (variant) {
        case "danger":
            return "bg-red-500 dark:bg-red-900";
        case "danger-outline":
            return "bg-white/50 border border-red-500 dark:bg-black/50 dark:border-red-400";
        case "outline":
            return "bg-white/50 border border-black/50 dark:bg-black/50 dark:border-white/50";
        case "primary":
            return "bg-black text-white dark:bg-white dark:text-black";
        case "secondary":
            return "bg-black/30 dark:bg-white/30";
        default:
            return "";
    }
};

const Card: React.FC<CardProps> = (props: CardProps) => {
    const classes = `${handleVariant(props.variant)} ${handleRoundness(
        props.roundness
    )}`;
    return (
        <div
            {...props}
            className={`${classes} p-4 outline-none ${props.className}`}
        >
            {props?.children}
        </div>
    );
};

export default Card;
