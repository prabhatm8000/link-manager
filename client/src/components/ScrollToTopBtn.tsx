import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";
import { Button } from "./ui/button";

const ScrollToTopBtn = ({
    containerRef,
}: {
    containerRef: React.RefObject<HTMLDivElement | null>;
}) => {
    const [showBtn, setShowBtn] = useState(false);
    const handleScrollToTop = () => {
        containerRef.current?.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        const handleScroll = () => {
            if (container.scrollTop > 300) {
                setShowBtn(true);
            } else {
                setShowBtn(false);
            }
        };
        container.addEventListener("scroll", handleScroll);
        return () => {
            container.removeEventListener("scroll", handleScroll);
        };
    }, []);
    return (
        <Button
            className={`fixed bottom-0 right-0 m-6 mb-20 text-2xl px-2 py-4 rounded-full transform ${
                showBtn ? "rotate-0 scale-100" : "rotate-180 scale-0"
            } transition-all duration-300 ease-out`}
            onClick={handleScrollToTop}
            variant="default"
            size={"icon"}
            aria-label="Scroll to top"
        >
            <FaArrowUp className="size-5" />
        </Button>
    );
};

export default ScrollToTopBtn;
