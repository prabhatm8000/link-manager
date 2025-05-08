const BottomCpRight = () => {
    return (
        <div className="text-xs text-muted-foreground px-2 pb-4">
            {"Build by"}{" "}
            <a
                href="https://github.com/prabhatm8000"
                target="_blank"
                rel="noreferrer"
                className="underline"
            >
                prabhatm8000
            </a>
            {" · Check out the public github repo"}{" "}
            <a
                href="https://github.com/prabhatm8000/link-manager"
                target="_blank"
                rel="noreferrer"
                className="underline"
            >
                here
            </a>
            {` · Ref.com © ${new Date().getFullYear()}`}
        </div>
    );
};

export default BottomCpRight;
