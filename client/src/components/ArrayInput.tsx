import { useState } from "react";
import { IoIosBackspace, IoIosClose } from "react-icons/io";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const ArrayInput = ({
    inputProps,
    arrayValues,
    setArrayValues,
}: {
    arrayValues: string[] | undefined;
    setArrayValues: React.Dispatch<React.SetStateAction<string[]>>;
    inputProps: React.ComponentProps<"input">;
}) => {
    const [inputValue, setInputValue] = useState<string>("");
    const handleRemoveBtn = (value: string) =>
        setArrayValues((p) => p.filter((v) => value !== v));

    const handleEnterHit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") {
            return;
        }
        // Prevent form submission
        e.preventDefault();
        setArrayValues((p) => {
            const s = new Set([...p, inputValue]);
            return Array.from(s);
        });
        setInputValue("");
    };

    return (
        <div className="flex flex-wrap gap-2">
            {arrayValues?.map((value, index) => (
                <span
                    key={index}
                    className="flex items-center bg-foreground/20 rounded-lg"
                >
                    <span className="pl-2">{value}</span>
                    <IoIosClose
                        className="size-8"
                        onClick={() => handleRemoveBtn(value)}
                    />
                </span>
            ))}
            <div className="flex justify-between items-center w-full">
                <Input
                    type={inputProps.type}
                    onKeyDown={handleEnterHit}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value.trim())}
                    {...inputProps}
                    // className="w-72"
                />
                <Button
                    variant={"ghost"}
                    size={"sm"}
                    type="button"
                    title="Clear all"
                    onClick={(_) => setArrayValues([])}
                >
                    <IoIosBackspace className="size-8 p-0" />
                </Button>
            </div>
        </div>
    );
};

export default ArrayInput;
