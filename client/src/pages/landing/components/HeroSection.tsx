import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { afterBeforeBorderClass } from "../Landing";
import TextHighlighting from "./textHighlighting";

const HeroSection = () => {
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once: false,
        margin: "0px 0px -300px 0px",
    });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0.5, x:-10 }}
            animate={isInView ? { opacity: 1, x:0 } : {}}
            transition={{ duration: 0.6, ease: "linear" }}
            className="px-6 pt-36 lg:pt-48"
            id="home"
        >
            <p className="mb-2">
                <span className="text-sm text-muted-foreground uppercase">
                    One platform. All your links. No compromises.
                </span>
            </p>

            <h1 className={`max-w-5xl text-8xl mb-8 ${afterBeforeBorderClass}`}>
                Link shortener on{" "}
                <span className="bg-yellow-400/50">steroids</span>!
            </h1>

            <TextHighlighting
                text="Ref is an **advanced link management platform** for
                        **business, creators, and growth teams** to **manage, track and analyse**
                        all the links and their events in one place (Ref.com)."
                className={`text-lg max-w-xl mb-4`}
                textClassName="text-muted-foreground/80"
                highlightedTextClassName="text-foreground/80 text-bold"
            />

            <div className={`flex gap-4 py-2 ${afterBeforeBorderClass}`}>
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
    );
};

export default HeroSection;
