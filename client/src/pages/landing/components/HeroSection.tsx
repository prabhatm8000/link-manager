import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import TextHighlighting from "./textHighlighting";

const HeroSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once: false,
        margin: "0px 0px -300px 0px",
    });
    return (
        <div
            className="relative min-h-screen flex items-center justify-center"
            id="home"
        >
            <motion.div
                className="absolute inset-0 z-0"
                style={
                    {
                        // Use CSS variable for dynamic gradient center
                        "--x": "60%",
                        backgroundImage:
                            "radial-gradient(175% 175% at var(--x) 10%, #00000000 20%, #720e9e 100%)",
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
            <motion.div
                ref={ref}
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={isInView ? { opacity: 1, filter: "blur(0px)" } : {}}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="px-6 items-center flex flex-col text-center"
            >
                <p className="mb-2">
                    <span className="text-sm text-muted-foreground uppercase">
                        One platform. All your links. No compromises.
                    </span>
                </p>

                <h1
                    className={`max-w-5xl text-5xl lg:text-8xl mb-8 leading-tight`}
                >
                    Link shortener on steroids!
                </h1>

                <TextHighlighting
                    text="Ref is an **advanced link management platform** for
                        **business, creators, and growth teams** to **manage, track and analyse**
                        all the links and their events in one place (Ref.com)."
                    className={`max-w-xl mb-4`}
                    textClassName="text-muted-foreground/70"
                    highlightedTextClassName="text-muted-foreground text-bold"
                />

                <div className={`flex gap-4 py-2`}>
                    <Button className="px-5 lg:px-10 rounded-full">
                        <Link to={"/auth/login"}>Get started</Link>
                    </Button>
                    <Button
                        variant={"outline"}
                        className="px-5 lg:px-10 rounded-full bg-foreground/10 text-foreground"
                    >
                        <a href="#pricing" className="w-full">
                            Pricing
                        </a>
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default HeroSection;
