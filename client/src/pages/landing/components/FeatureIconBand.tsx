import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import landingData from "../data/landing";

const FeatureIconBand = () => {
    const ref = useRef(null);

    // Tracks scroll progress between 0 and 1 for the `ref` element
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"], // triggers as it comes in and leaves viewport
    });

    // Map scroll progress to X movement (from -50% to +50%)
    const x = useTransform(scrollYProgress, [0, 1], ["-100%", "100%"]);

    return (
        <div ref={ref} className="relative p-6 flex flex-col justify-center">
            <motion.div
                style={{ x: x }}
                className="w-full inline-flex justify-between items-center gap-4"
            >
                {landingData.features.map((f) => f.icon)}
            </motion.div>
        </div>
    );
};

export default FeatureIconBand;
