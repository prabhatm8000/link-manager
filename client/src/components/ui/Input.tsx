import { useState } from "react";
import {
    getRoundnessClasses,
    getVariantClasses,
    type BasicElementProps,
} from "./classUtity";

interface InputProps
    extends BasicElementProps,
        React.InputHTMLAttributes<HTMLInputElement> {
    type: string;
    placeholder: string;
    value?: string;
    name?: string;
    placeholderClass?: string;
}
const Input: React.FC<InputProps> = ({ ...props }: InputProps) => {
    const [showLabel, setShowLabel] = useState(false);

    return (
        <div className="relative py-3">
            <label
                className={`absolute top-[50%] text-black/60 dark:text-white/60 transform ${
                    showLabel
                        ? "-translate-y-[225%] text-xs px-0"
                        : "-translate-y-[50%] px-2"
                } duration-300 ease-out ${props.placeholderClass}`}
                htmlFor={props.id}
            >
                {props.placeholder}
            </label>
            <input
                {...props}
                className={`p-2 text-md bg-white/60 dark:bg-black/60 outline-none ${getVariantClasses(
                    props.variant
                )} ${getRoundnessClasses(props.roundness)} ${props.className}`}
                onClick={props.onClick}
                type={props.type}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    if (!e.target.value) {
                        setShowLabel(false);
                    } else {
                        setShowLabel(true);
                    }
                    if (props?.onChange) props?.onChange(e);
                }}
                // onFocus={() => setShowLabel(true)}
                // onBlur={() => setShowLabel(false)}
            ></input>
        </div>
    );
};

export default Input;
