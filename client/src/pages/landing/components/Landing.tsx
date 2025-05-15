import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import NavBar from "../../../components/NavBar";
import TextHighlighting from "./textHighlighting";

export const afterBeforeBorderClass = "relative before:absolute before:top-0 before:-left-[100dvw] before:h-px before:w-[200dvw] before:bg-border after:absolute after:bottom-0 after:-left-[100dvw] after:h-px after:w-[200dvw] after:bg-border";

const Landing = () => {
    return (
        <div className="overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <NavBar />
                <div className="p-6">
                    <div className="mt-20 lg:mt-36">
                        <p className="mb-2">
                            <span className="text-xs text-muted-foreground uppercase orbitron-500">
                                Short links managment - Events - Analytics
                            </span>
                        </p>

                        <h1 className={`max-w-5xl text-6xl sm:text-8xl mb-8 ${afterBeforeBorderClass}`}>
                            Link shortener on{" "}
                            <span className="bg-yellow-400/50">steroids</span>!
                        </h1>

                        <TextHighlighting
                            text="Ref is an **advanced link management platform** for
                        **business, creators, and growth teams** to **manage and track**
                        all the links in one place (Ref.com)."
                            className={`text-lg max-w-xl mb-8 ${afterBeforeBorderClass}`}
                            textClassName="text-muted-foreground"
                            highlightedTextClassName="text-foreground"
                        />

                        <div className={`flex gap-4 py-2 ${afterBeforeBorderClass}`}>
                            <Button className="px-5 lg:px-10 rounded-full">
                                <Link to={"/auth/login"}>Get started</Link>
                            </Button>
                            <Button
                                variant={"outline"}
                                className="px-5 lg:px-10 rounded-full bg-foreground/10 text-foreground"
                            >
                                Pricing
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
