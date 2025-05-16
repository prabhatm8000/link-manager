import landingData from "../data/landing";
import { afterBeforeBorderClass } from "../Landing";
import TextHighlighting from "./textHighlighting";

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

            <div className="flex flex-col gap-14">
                {landingData.features.map((feature) => (
                    <div
                        key={feature.id}
                        className={`flex flex-col gap-1 ${afterBeforeBorderClass}`}
                    >
                        <div className="flex gap-2 items-center">
                            {feature.icon}
                            <h2
                                className={`text-2xl font-semibold ${afterBeforeBorderClass}`}
                            >
                                {feature.title}
                            </h2>
                        </div>
                        <TextHighlighting
                            text={feature.description}
                            className={`text-sm ml-8`}
                            textClassName="text-muted-foreground/80"
                            highlightedTextClassName="text-foreground/80 text-bold"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturesSection;
