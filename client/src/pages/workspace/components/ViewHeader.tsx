import { IoIosLink } from "react-icons/io";
import { Link } from "react-router-dom";
import TitleText from "../../../components/TitleText";

const ViewHeader = ({
    heading,
    subHeading,
}: {
    heading: string;
    subHeading?: string | React.ReactNode;
}) => {
    if (heading.length < 3) throw new Error("Heading too short, min length 3");
    return (
        <div className="flex flex-col gap-4 py-4 px-2">
             <Link to={"/"} className="md:hidden">
                <TitleText className="text-xl flex gap-2 justify-start items-center">
                    <IoIosLink />
                    <span>Ref.com</span>
                </TitleText>
            </Link>

            <TitleText className="text-4xl font-bold">
                {heading}
            </TitleText>
            {/* <h1 className="text-3xl font-bold">{heading}</h1> */}
            <h4 className="text-sm text-muted-foreground">{subHeading}</h4>
        </div>
    );
};

export default ViewHeader;
