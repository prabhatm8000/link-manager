import { useState } from "react";
import { getRoundnessClasses, getVariantClasses, type BasicElementProps } from "./classUtity";

interface InputProps extends BasicElementProps {
    type: string;
    placeholder: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    name?: string;
    placeholderClass?: string;
}
const Input: React.FC<InputProps> = (props: InputProps) => {
    const [showLabel, setShowLabel] = useState(false);

    return (
        <div className="relative py-5">
            <label
                className={`absolute top-[50%] px-2 text-black/60 dark:text-white/60 transform ${
                    showLabel
                        ? "-translate-y-[200%] text-sm"
                        : "-translate-y-[50%]"
                } duration-300 ease-out ${props.placeholderClass}`}
            >
                {props.placeholder}
            </label>
            <input
                className={`p-2 text-md bg-white/60 dark:bg-black/60 outline-none ${getVariantClasses(props.variant)} ${getRoundnessClasses(
                    props.roundness
                )} ${props.className}`}
                onClick={props.onClick}
                type={props.type}
                // placeholder={props.placeholder}
                onChange={props.onChange}
                onFocus={() => setShowLabel(true)}
                onBlur={() => setShowLabel(false)}
                value={props.value}
                name={props.name}
            ></input>
        </div>
    );
};

export default Input;
