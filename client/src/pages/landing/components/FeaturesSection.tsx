import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import landingData from "../data/landing";
import { afterBeforeBorderClass } from "../Landing";
import TextHighlighting from "./textHighlighting";

const Feature = ({ f }: { f: (typeof landingData.features)[0] }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once: false,
        margin: "0px 0px -60px 0px",
    });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            key={f.id}
            className={`flex flex-col gap-1 ${afterBeforeBorderClass}`}
        >
            <div className="flex gap-2 items-center">
                {f.icon}
                <h2
                    className={`text-2xl font-semibold ${afterBeforeBorderClass}`}
                >
                    {f.title}
                </h2>
            </div>
            <TextHighlighting
                text={f.description}
                className={`text-sm ml-8`}
                textClassName="text-muted-foreground/80"
                highlightedTextClassName="text-foreground/80 text-bold"
            />
        </motion.div>
    );
};

const FeaturesSection = () => {
    return (
        <div className="px-6 mt-36 lg:mt-48" id="features">
            {/* <h1 className="text-3xl font-semibold mb-16">Features</h1> */}
            <p className="mb-2">
                <span className="text-sm text-muted-foreground uppercase">
                    Features
                </span>
            </p>

            <h1
                className={`max-w-5xl text-5xl mb-14 ${afterBeforeBorderClass}`}
            >
                Not just shorter —
                <span className="bg-yellow-400/50">smarter</span>!
            </h1>

            <div className="flex flex-col gap-14 fade-in-on-scroll">
                {landingData.features.map((feature) => (
                    <Feature key={feature.id} f={feature} />
                ))}
            </div>
        </div>
    );
};

export default FeaturesSection;
