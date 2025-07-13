import TitleText from "@/components/TitleText";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import landingData from "../data/landing";

const PricingCard = ({
    price,
    currencyType,
}: {
    price: (typeof landingData.pricing)[0];
    currencyType?: "INR" | "USD";
}) => {
    const currency = currencyType || "INR";
    const ref = useRef(null);
    const isInView = useInView(ref, {
        once: false,
        margin: "0px 0px -200px 0px",
    });
    return (
        <motion.div
            key={price.id}
            ref={ref}
            initial={{ opacity: 0, y: 40, scale: 1 }}
            animate={
                isInView
                    ? { opacity: 1, y: 0, scale: price.popped ? 1.25 : 1 }
                    : {}
            }
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative"
        >
            <motion.div
                className="absolute inset-0 -z-10 rounded-xl"
                style={{
                    background:
                        "radial-gradient(125% 125% at 50% 10%, #00000000 40%, #720e9e 100%)",
                }}
            />
            <Card
                className={`w-xs ${
                    price.popped
                        ? "border-muted-foreground bg-transparent"
                        : "border-muted-foreground/40"
                }`}
            >
                <CardHeader className="text-center">
                    <CardTitle>
                        <TitleText>{price.title}</TitleText>
                    </CardTitle>
                    <CardDescription>{price.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-6">
                    <div className="flex gap-1 items-end">
                        <h2 className="text-4xl font-semibold">
                            {price.prices[currency]}
                        </h2>
                        <span className="text-xl text-muted-foreground">
                            /{price.per}
                        </span>
                    </div>

                    <div className="flex flex-col items-center gap-4">
                        {price.features.map((feature) => (
                            <p key={feature}>{feature}</p>
                        ))}
                    </div>

                    <Button
                        className={`w-full ${
                            price.popped
                                ? "bg-foreground/80 hover:bg-foreground"
                                : "bg-foreground/60 hover:bg-foreground/80"
                        }`}
                    >
                        <Link className="w-full" to={"/auth/login"}>
                            Get started
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const PricingCards = ({ currencyType }: { currencyType?: "INR" | "USD" }) => {
    return (
        <div className="relative min-h-screen flex items-center justify-center">
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
            <div className="px-6 text-center" id="pricing">
                <p className="mb-2">
                    <span className="text-sm text-muted-foreground uppercase">
                        Pricing
                    </span>
                </p>

                <h1 className={`text-5xl mb-28`}>
                    Start free, scale effortlessly.
                </h1>

                <div className="flex items-center justify-center flex-col lg:flex-row gap-20">
                    {landingData.pricing.map((price) => (
                        <PricingCard
                            key={price.id}
                            price={price}
                            currencyType={currencyType}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PricingCards;
