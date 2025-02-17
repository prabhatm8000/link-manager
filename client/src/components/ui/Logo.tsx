import { IoIosLink } from "react-icons/io";
import TitleText from "../TitleText";

const Logo = ({
    logoSize,
    className,
    showLogo = true,
    showText = true,
}: {
    logoSize?: string;
    className?: string;
    showLogo?: boolean;
    showText?: boolean;
}) => {
    return (
        <TitleText
            variant="none"
            className={`text-3xl flex gap-2 items-center ${className}`}
        >
            {showLogo && <IoIosLink size={logoSize} />}
            {showText && <span>Ref.com</span>}
        </TitleText>
    );
};

export default Logo;
