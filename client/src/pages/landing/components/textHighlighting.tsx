import { cn } from "@/lib/utils";

/**
 * wrap the text you wanna highlight in double asterisk
 * example (**Text** will be highlighted)
 */
const TextHighlighting = ({
    text,
    className,
    textClassName,
    highlightedTextClassName,
}: {
    text: string;
    className?: string;
    textClassName?: string;
    highlightedTextClassName?: string;
}) => {
    text = `${text} `;
    const textArr = [];
    let aText = "";
    let aHighlightedText = "";
    let push = false;
    for (let i = 0; i < text.length - 1; i += 1) {
        if (text[i] === "*" && text[i + 1] === "*") {
            push = !push;
            continue;
        }

        if (i > 0 && text[i - 1] === "*" && text[i] === "*") {
            continue;
        }

        if (push) {
            if (aText) {
                textArr.push(
                    <span key={i} className={textClassName}>
                        {aText}
                    </span>
                );
            }
            aText = "";
            aHighlightedText += text[i];
        } else {
            if (aHighlightedText) {
                textArr.push(
                    <span key={i} className={highlightedTextClassName}>
                        {aHighlightedText}
                    </span>
                );
            }
            aText += text[i];
            aHighlightedText = "";
        }
    }

    if (aText) {
        textArr.push(
            <span key={text.length} className={textClassName}>
                {aText}
            </span>
        );
    }
    if (aHighlightedText) {
        textArr.push(
            <span key={text.length + 1} className={highlightedTextClassName}>
                {aHighlightedText}
            </span>
        );
    }
    return <p className={cn(className, "")}>{textArr.map((item) => item)}</p>;
};

export default TextHighlighting;
