const HeroVideo = () => {
    return (
        <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 left-1/5 -z-10 aspect-video opacity-50"
        >
            <video
                loop
                autoPlay
                muted
                playsInline
                // width={852}
                // height={480}
                className="absolute size-full object-right"
            >
                <source src="/video/landing-bg.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 size-full bg-linear-to-r from-background to-75%"></div>
            <div className="absolute inset-0 size-full bg-linear-to-t from-background to-50%"></div>
        </div>
    );
};

export default HeroVideo;
