import BottomCpRight from "@/components/BottomCpRight";
import Logo from "@/components/ui/Logo";
import { Link } from "react-router-dom";
import landingData from "../data/landing";

const FooterSection = () => {
    return (
        <div className="mt-14 pt-6 w-full bg-foreground text-background">
            <div className="relative max-w-7xl mx-auto p-6">
                {/* <div className="flex flex-col gap-4 lg:flex-row lg:gap-24 w-full"> */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.3fr_0.7fr] w-full">
                    <div className="">
                        <Link to="/" className="w-fit">
                            <Logo className="" />
                        </Link>
                    </div>

                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {landingData.footerSectionData.map((section, i) => (
                            <div key={i} className="flex flex-col gap-2">
                                <h5>{section.title}</h5>
                                <div className="flex flex-col gap-2 text-sm text-background/60">
                                    {section.links.map((link, i) => (
                                        <a
                                            key={i}
                                            href={link.link}
                                            className="hover:text-background"
                                        >
                                            {link.title}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="text-center mt-10">
                    <BottomCpRight />
                </div>
            </div>
        </div>
    );
};

export default FooterSection;
