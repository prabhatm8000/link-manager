const CommingSoon = ({className, text}: {className?: string, text?: string}) => {
    return (
        <span className={`px-1 text-xs text-yellow-600 dark:text-yellow-400 ${className}`}>
            {text || "*Coming soon"}
        </span>
    );
};

export default CommingSoon;
