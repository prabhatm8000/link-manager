interface TitleTextProps {
    className?: string;
    children?: React.ReactNode;
}

const TitleText = ({ className, children }: TitleTextProps) => {
    return (
        <div className={`text-3xl orbitron-500 ${className}`}>{children}</div>
    );
};

export default TitleText;
