import { QRCodeSVG } from "qrcode.react";
import { Label } from "./ui/label";

const QRCode = ({ url }: { url: string }) => {
    return (
        <div>
            <Label>QR Code</Label>
            <div className="mt-2 flex justify-center items-center w-full h-28 p-2 bg-inherit rounded-md border border-ring/50">
                <QRCodeSVG
                    value={url}
                    height={75}
                    width={75}
                    bgColor="var(--background)"
                    fgColor="var(--accent-foreground)"
                    imageSettings={{
                        src: "/logo.svg",
                        height: 32,
                        width: 32,
                        excavate: true,
                    }}
                />
            </div>
        </div>
    );
};

export default QRCode;
