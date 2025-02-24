import TitleText from "../../../components/TitleText";

const ViewHeader = ({
    heading,
    subHeading,
}: {
    heading: string;
    subHeading?: string;
}) => {
    return (
        <div className="flex flex-col gap-4 py-4 px-2">
            <TitleText className="text-4xl font-bold">{heading}</TitleText>
            {/* <h1 className="text-3xl font-bold">{heading}</h1> */}
            <h4 className="text-sm text-black/50 dark:text-white/50">
                {subHeading}
            </h4>
        </div>
    );
};

export default ViewHeader;
