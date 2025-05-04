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
            <TitleText className="text-4xl font-bold">
                {heading}
            </TitleText>
            {/* <h1 className="text-3xl font-bold">{heading}</h1> */}
            <h4 className="text-sm text-muted-foreground">{subHeading}</h4>
        </div>
    );
};

export default ViewHeader;
