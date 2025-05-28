import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { afterBeforeBorderClass } from "../Landing";

const BottomHero = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once: false,
        margin: "0px 0px -300px 0px",
    });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, ease: "easeOut" }}
            className="px-6 mt-36 lg:mt-48"
        >
            <p className="mb-2">
                <span className="text-sm text-muted-foreground uppercase">
                    Cut the clutter. Track what matters.
                </span>
            </p>

            <h1 className={`max-w-5xl text-8xl mb-8 flex flex-col ${afterBeforeBorderClass}`}>
                <span>Smarter links.</span>
                <span>Sharper insights.</span>
                <span>Stronger results.</span>
            </h1>
            <Button
                variant={"ghost"}
                className={`text-xl ${afterBeforeBorderClass}`}
            >
                Hop in!
            </Button>
        </motion.div>
    );
};

export default BottomHero;
