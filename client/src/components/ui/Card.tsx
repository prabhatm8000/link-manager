import {
    getRoundnessClasses,
    getVariantClasses,
    type BasicElementProps,
} from "./classUtity";

interface CardProps extends BasicElementProps {}
const Card: React.FC<CardProps> = (props: CardProps) => {
    return (
        <div
            className={`p-4 ${getRoundnessClasses(
                props.roundness
            )} ${getVariantClasses(props.variant)} ${props.className}`}
        >
            {props?.children}
        </div>
    );
};

export default Card;
