import { FC } from "react";
import {
    getRoundnessClasses,
    getVariantClasses,
    type BasicElementProps,
} from "./classUtity";

interface ButtonProps
    extends BasicElementProps,
        React.ButtonHTMLAttributes<HTMLButtonElement> {
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    onClick?: (event: React.MouseEvent) => void;
}

const Button: FC<ButtonProps> = ({
    children,
    className,
    onClick,
    type,
    variant,
    roundness,
    disabled,
}) => {
    return (
        <button
            className={`p-2 text-md hover:opacity-75 disabled:opacity-45 ${getRoundnessClasses(
                roundness
            )} ${getVariantClasses(variant)} ${className}`}
            disabled={disabled}
            onClick={onClick}
            type={type}
        >
            {children}
        </button>
    );
};

export default Button;
