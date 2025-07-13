import NavBar from "../../components/NavBar";
import BottomHero from "./components/BottomHero";
import FeaturesSection from "./components/FeaturesSection";
import FooterSection from "./components/FooterSection";
import HeroSection from "./components/HeroSection";
import PricingCards from "./components/PricingCards";

export const afterBeforeBorderClass =
    "relative before:absolute before:top-0 before:-left-[100dvw] before:h-px before:w-[200dvw] before:bg-border after:absolute after:bottom-0 after:-left-[100dvw] after:h-px after:w-[200dvw] after:bg-border";

("From clicks to insights — everything in one place.");

const Landing = () => {
    const currency = "INR";
    return (
        <div className="overflow-hidden min-h-screen w-full relative">
            <NavBar />
            <div className="max-w-8xl mx-auto w-full relative">
                {/* <HeroVideo /> */}
                <HeroSection />
                <BottomHero />
                <FeaturesSection />
                <PricingCards currencyType={currency} />
            </div>
            <FooterSection />
        </div>
    );
};

export default Landing;
