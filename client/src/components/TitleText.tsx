import { getVariantClasses, type BasicElementProps } from "./ui/classUtity";

interface TitleTextProps extends BasicElementProps {}

const TitleText = ({ className, children, variant }: TitleTextProps) => {
    return (
        <div
            className={`text-3xl orbitron-500 ${getVariantClasses(
                variant
            )} ${className}`}
        >
            {children}
        </div>
    );
};

export default TitleText;
