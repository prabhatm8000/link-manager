import { FC } from "react";
import { handleRoundness } from "./classUtity";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?:
        | "primary"
        | "outline"
        | "secondary"
        | "danger"
        | "danger-outline"
        | "none";
    roundness?: "full" | "light" | "";
}

const handleVariant = (variant: ButtonProps["variant"]) => {
    switch (variant) {
        case "danger":
            return "bg-red-500 text-white hover:bg-red-700 dark:bg-red-900 dark:hover:bg-red-950";
        case "danger-outline":
            return "bg-white/50 border border-red-500 text-red-500 hover:bg-red-200/50 dark:bg-black/50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-950/50";
        case "none":
            return "hover:bg-black/10 dark:hover:bg-white/10";
        case "outline":
            return "bg-white/50 border border-black/50 hover:bg-black/10 dark:bg-black/50 dark:border-white/50 dark:hover:bg-white/10";
        case "secondary":
            return "bg-black/20 hover:bg-black/10 dark:bg-white/20 dark:hover:bg-white/10";
        default:
            return "hover:opacity-70 bg-black text-white dark:bg-white dark:text-black";
    }
};

const Button: FC<ButtonProps> = (props) => {
    const classes = `${handleVariant(props.variant)} ${handleRoundness(
        props.roundness
    )}`;
    return (
        <button
            {...props}
            className={`p-2 outline-none disabled:opacity-70 ${classes} ${props.className}`}
            disabled={props.disabled}
            onClick={props.onClick}
            type={props.type}
        >
            {props.children}
        </button>
    );
};

export default Button;
