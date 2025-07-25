const BottomCpRight = () => {
    return (
        <div className="bottom-0 text-xs text-muted-foreground w-full my-1 flex flex-col items-center md:flex-row md:justify-center gap-1">
            <span>
                {"Build by"}{" "}
                <a
                    href="https://github.com/prabhatm8000"
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                >
                    prabhatm8000
                </a>
                {" • Check out the public github repo "}
                <a
                    href="https://github.com/prabhatm8000/link-manager"
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                >
                    here
                </a>
            </span>
            <span>{` • Ref.com © ${new Date().getFullYear()}. All rights reserved.`}</span>
        </div>
    );
};

export default BottomCpRight;
