import NavBar from "@/components/NavBar";
import TitleText from "@/components/TitleText";
import { PiLinkBreak } from "react-icons/pi";
import { Link } from "react-router-dom";

const PageNotFound = () => {
    return (
        <div className="h-screen">
            <NavBar />

            <div className="flex flex-col items-center justify-center gap-14 mt-20 p-10">
                <div className="flex flex-col items-center justify-center">
                    <TitleText className="text-7xl">404</TitleText>
                    <TitleText>Page Not Found</TitleText>
                    <p className="text-muted-foreground mt-5 text-center">
                        The page you are looking for does not exist. <br />
                        Click{" "}
                        <Link to="/" className="text-blue-400">
                            here
                        </Link>{" "}
                        to go back to the homepage.
                    </p>
                </div>
                <PiLinkBreak className="" size={150} />
            </div>
        </div>
    );
};

export default PageNotFound;
