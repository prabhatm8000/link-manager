import { useState } from "react";
import { handleRoundness } from "./classUtity";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    placeholderClass?: string;
    variant?:
        | "primary"
        | "outline"
        | "secondary"
        | "danger"
        | "danger-outline"
        | "none";
    roundness?: "full" | "light" | "";
}

const handleVariant = (variant: InputProps["variant"]) => {
    switch (variant) {
        case "danger":
            return "bg-red-500 text-white hover:bg-red-800 dark:bg-red-900";
        case "danger-outline":
            return "bg-white/50 border border-red-500 text-red-500 hover:bg-red-200/50 dark:bg-black/50 dark:border-red-400 dark:text-red-400 dark:hover:bg-red-950/50";
        case "none":
            return "hover:bg-black/10 dark:hover:bg-white/10";
        case "outline":
            return "bg-white/50 border border-black/50 hover:bg-black/10 dark:bg-black/50 dark:border-white/50 dark:hover:bg-white/10";
        case "secondary":
            return "bg-black/30 dark:bg-white/30";
        default:
            return "hover:opacity-60 bg-black text-white placeholder:text-white/60 dark:bg-white dark:text-black dark:placeholder:text-black/60";
    }
};

const Input: React.FC<InputProps> = (props: InputProps) => {
    const [showLabel, setShowLabel] = useState(false);
    const handleShowLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) {
            setShowLabel(false);
        } else {
            setShowLabel(true);
        }
    };

    const classes = `${handleVariant(props.variant)} ${handleRoundness(
        props.roundness
    )}`;

    return (
        <div className="relative py-3">
            {props.placeholder && (
                <label
                    className={`cursor-text absolute top-[50%] left-1 transform text-xs w-fit ${
                        showLabel
                            ? "-translate-y-[225%] opacity-100"
                            : "translate-y-[100%] opacity-0"
                    } transition-all duration-300 ease-out ${
                        props.placeholderClass
                    }`}
                    htmlFor={props.id}
                    style={{
                    }}
                >
                    {props.placeholder}
                </label>
            )}
            <input
                {...props}
                className={`p-2 outline-none ${classes} ${props.className}`}
                onClick={props.onClick}
                type={props.type}
                onChange={handleShowLabel}
                onLoad={handleShowLabel}
            ></input>
        </div>
    );
};

export default Input;
