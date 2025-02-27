const CommingSoon = ({className}: {className?: string}) => {
    return (
        <span className={`px-1 text-xs text-yellow-600 dark:text-yellow-400 ${className}`}>
            {"*Coming soon"}
        </span>
    );
};

export default CommingSoon;
