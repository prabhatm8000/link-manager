import { QRCodeSVG } from "qrcode.react";

const QRCode = ({ url }: { url: string }) => {
    return (
        <div
            className="flex justify-center items-center w-full p-4 bg-inherit rounded-md border border-accent-foreground/20"
        >
            <QRCodeSVG value={url} bgColor="var(--background)" fgColor="var(--accent-foreground)" opacity={0.7} imageSettings={{
                src: "/logo.svg",
                height: 32,
                width: 32,
                excavate: true,
            }} />
        </div>
    );
};

export default QRCode;
