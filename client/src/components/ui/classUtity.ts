import type { ReactNode } from "react";

export interface BasicElementProps {
    children?: ReactNode;
    className?: string;
    variant?:
        | "highlight"
        | "highlight-outline"
        | "primary"
        | "outline"
        | "secondary"
        | "danger"
        | "danger-outline"
        | "none";
    roundness?: "none" | "full" | "pill" | "light";
}

export const getVariantClasses = (variant: BasicElementProps["variant"]) => {
    switch (variant) {
        case "outline":
            return "bg-white border border-black/35 dark:border-white/35 dark:text-white dark:bg-black";
        case "danger":
            return "bg-red-500 text-white dark:bg-red-900 dark:text-white";
        case "danger-outline":
            return "bg-white border border-red-500 text-red-500 dark:border-red-400 dark:text-red-400 dark:bg-black";
        case "highlight":
            return "bg-blue-400 text-white dark:bg-blue-400 dark:text-black";
        case "highlight-outline":
            return "bg-white border border-blue-400 text-blue-400 dark:border-blue-400 dark:text-blue-400 dark:bg-black";
        case "none":
            return "hover:bg-stone-200 dark:hover:bg-stone-800";
        case "secondary":
            return "bg-black/10 text-black dark:bg-white/10 dark:text-white";
        default:
            return "hover:opacity-70 bg-black text-white dark:bg-white dark:text-black";
    }
};

export const getRoundnessClasses = (
    roundness: BasicElementProps["roundness"]
) => {
    switch (roundness) {
        case "full":
            return "rounded-full";
        case "light":
            return "rounded-lg";
        default:
            return "rounded-none";
    }
};

export const handleRoundness = (roundness?: "full" | "light" | "") => {
    switch (roundness) {
        case "full":
            return "rounded-full";
        case "light":
            return "rounded-lg";
        default:
            return "rounded-none";
    }
};
