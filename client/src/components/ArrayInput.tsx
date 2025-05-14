import { useEffect, useRef, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { IoRemoveCircleOutline } from "react-icons/io5";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const suggestionsStore = new Map<string, string[]>();

const ArrayInput = ({
    inputProps,
    arrayValues,
    setArrayValues,
    getSuggestions,
    limit
}: {
    arrayValues: string[] | undefined;
    setArrayValues: React.Dispatch<React.SetStateAction<string[]>>;
    inputProps: React.ComponentProps<"input">;
    getSuggestions: (q: string) => Promise<string[]>;
    limit?: number
}) => {
    const [inputValue, setInputValue] = useState<string>("");
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const suggestionsRef = useRef<HTMLDivElement | null>(null);

    const handleAdd = (val: string) => {
        setArrayValues((p) => {
            const s = new Set([...p, val]);
            if (limit && s.size > limit) {
                alert("max limit reached!");
                return p;
            }
            return Array.from(s);
        });
        setInputValue("");
    };
    const handleRemoveBtn = (value: string) =>
        setArrayValues((p) => p.filter((v) => value !== v));
    const handleEnterHit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape") {
            setShowSuggestions(false);
        }
        if (e.key !== "Enter") {
            return;
        }
        // Prevent form submission
        e.preventDefault();
        handleAdd(inputValue);
    };
    const getSuggestionWithCache = async (q: string) => {
        if (suggestionsStore.has(q)) {
            setSuggestions(suggestionsStore.get(q) || []); // won't be undefined. You know! why.
        } else {
            const suggestions = await getSuggestions(q);
            suggestionsStore.set(q, suggestions);
            setSuggestions(suggestions);
        }
    };
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        // Check if blur event is caused by clicking inside the suggestions div
        if (suggestionsRef?.current && suggestionsRef.current.contains(e.relatedTarget)) {
            return;
        }
        setShowSuggestions(false);
    };
    
    // debounce
    useEffect(() => {
        if (inputValue.length < 2) {
            setSuggestions([]);
            return;
        }

        const timeoutId = setTimeout(() => {
            getSuggestionWithCache(inputValue);
        }, 500);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [inputValue]);

    // console.log(suggestions);

    return (
        <div className="flex flex-wrap gap-2">
            {arrayValues?.map((value, index) => (
                <span
                    key={index}
                    className="flex items-center bg-ring/40 rounded-md"
                >
                    <span className="pl-2">{value}</span>
                    <IoIosClose
                        className="size-8"
                        onClick={() => handleRemoveBtn(value)}
                    />
                </span>
            ))}
            <div className="flex justify-between items-center gap-2 w-full">
                <div className="relative w-full">
                    <Input
                        type={inputProps.type}
                        onKeyDown={handleEnterHit}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value.trim())}
                        {...inputProps}
                        onFocus={(_) => setShowSuggestions(true)}
                        onBlur={handleBlur}
                        autoComplete="off"
                    />
                    {showSuggestions && suggestions.length > 0 && (
                        <div ref={suggestionsRef} className="absolute z-50 top-full w-full my-2 p-1 rounded-md bg-background border border-ring ring-[3px] ring-ring/50 flex flex-col gap-1">
                            {suggestions.map((s, i) => (
                                <span
                                    key={i}
                                    className="px-2 py-1 text-sm bg-ring/30 hover:bg-ring/50 rounded-sm cursor-pointer"
                                    onMouseDown={(e) => e.preventDefault()} // Prevent blur
                                    onClick={() => handleAdd(s)}
                                >
                                    {s}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                <Button
                    variant={"outline"}
                    size={"icon"}
                    type="button"
                    title="Clear all"
                    onClick={(_) => setArrayValues([])}
                >
                    <IoRemoveCircleOutline className="text-destructive size-4 p-0" />
                </Button>
            </div>
        </div>
    );
};

export default ArrayInput;
