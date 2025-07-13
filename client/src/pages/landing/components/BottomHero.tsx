"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const BottomHero = () => {
    const ref = useRef(null);

    // Tracks scroll progress between 0 and 1 for the `ref` element
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"], // triggers as it comes in and leaves viewport
    });

    // Map scroll progress to X movement (from -50% to +50%)
    const x = useTransform(scrollYProgress, [0, 0.5], ["-60%", "0%"]);

    return (
        <div ref={ref} className="relative px-6 flex flex-col justify-center">
            <p className="mb-2 text-center">
                <span className="text-sm text-muted-foreground uppercase">
                    Cut the clutter. Track what matters.
                </span>
            </p>

            <h1
                className={`relative text-8xl flex flex-col overflow-hidden text-center`}
            >
                <motion.span style={{ x }} className="w-full inline-block">
                    Smarter links.
                </motion.span>
                <motion.span style={{ x }} className="w-full inline-block">
                    Sharper insights.
                </motion.span>
                <motion.span style={{ x }} className="w-full inline-block">
                    Stronger results.
                </motion.span>
            </h1>

            <motion.button className="text-xl mt-8">Hop in!</motion.button>
        </div>
    );
};

export default BottomHero;
