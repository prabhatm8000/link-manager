import TitleText from "@/components/TitleText";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";
import { Link } from "react-router-dom";
import landingData from "../data/landing";
import { afterBeforeBorderClass } from "../Landing";

const PricingCards = ({ currencyType }: { currencyType?: "INR" | "USD" }) => {
    const currency = currencyType || "INR";
    return (
        <div className="px-6 mt-36 lg:mt-48" id="pricing">
            <p className="mb-2">
                <span className="text-sm text-muted-foreground uppercase">
                    Pricing
                </span>
            </p>

            <h1
                className={`max-w-5xl text-5xl mb-28 ${afterBeforeBorderClass}`}
            >
                Start <span className="bg-yellow-400/50">free</span>, scale
                effortlessly.
            </h1>

            <div className="flex items-center justify-center flex-col lg:flex-row gap-20">
                {landingData.pricing.map((price) => (
                    <Card
                        key={price.id}
                        className={`w-xs ${
                            price.popped
                                ? "scale-110 md:scale-125 border-yellow-400 bg-yellow-400/10 dark:bg-yellow-400/30"
                                : ""
                        }`}
                    >
                        <CardHeader className="text-center">
                            <CardTitle>
                                <TitleText>{price.title}</TitleText>
                            </CardTitle>
                            <CardDescription>
                                {price.description}
                            </CardDescription>
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
                                        ? "bg-yellow-400 hover:bg-yellow-500 text-black"
                                        : ""
                                }`}
                            >
                                <Link className="w-full" to={"/auth/login"}>
                                    Get started
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default PricingCards;
