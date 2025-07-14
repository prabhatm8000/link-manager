import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import landingData from "../data/landing";
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
            className={`relative flex flex-col gap-1 bg-background border border-muted-foreground/20 rounded-xl p-4`}
        >
            <div className="flex gap-2 items-center">
                {f.icon}
                <h2 className={`text-2xl font-semibold`}>{f.title}</h2>
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
        <div
            className="relative min-h-screen flex items-center justify-center"
            id="features"
        >
            <motion.div
                className="absolute inset-0 z-0"
                style={
                    {
                        // Use CSS variable for dynamic gradient center
                        "--x": "60%",
                        backgroundImage:
                            "radial-gradient(175% 175% at var(--x) 90%, #00000000 20%, #01b4ff 100%)",
                        backgroundRepeat: "no-repeat",
                    } as React.CSSProperties
                }
                animate={{
                    "--x": ["40%", "60%", "40%"],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "circInOut",
                }}
            />
            <div className="p-6 flex flex-col items-center">
                {/* <h1 className="text-3xl font-semibold mb-16">Features</h1> */}
                <p className="mb-2">
                    <span className="text-sm text-muted-foreground uppercase">
                        Features
                    </span>
                </p>

                <h1 className={`max-w-5xl text-5xl mb-14`}>
                    Not just shorter — smarter!
                </h1>

                <div className="max-w-7xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 fade-in-on-scroll">
                    {landingData.features.map((feature) => (
                        <Feature key={feature.id} f={feature} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturesSection;
