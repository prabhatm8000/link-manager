import { Button } from "@/components/ui/button";
import { afterBeforeBorderClass } from "../Landing";

const BottomHero = () => {
    return (
        <div className="px-6 mt-36 lg:mt-48">
            <p className="mb-2">
                <span className="text-sm text-muted-foreground uppercase">
                    Cut the clutter. Track what matters.
                </span>
            </p>

            <h1 className={`max-w-5xl text-8xl mb-8 ${afterBeforeBorderClass}`}>
                Smarter links. Sharper insights. Stronger results.
            </h1>
            <Button
                variant={"ghost"}
                className={`text-xl ${afterBeforeBorderClass}`}
            >
                Hop in!
            </Button>
        </div>
    );
};

export default BottomHero;
