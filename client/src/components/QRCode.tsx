import { QRCodeSVG } from "qrcode.react";
import { Label } from "./ui/label";

const QRCode = ({ url }: { url: string }) => {
    const qrUrl = `${url}?qr=yes`;
    return (
        <div>
            <Label>QR Code</Label>
            <div className="overflow-hidden mt-2 flex flex-col justify-center items-center w-full h-28 p-2 bg-inherit rounded-md border border-ring/50">
                <div className="z-0 flex flex-col">
                    
                </div>
                <div className="absolute z-20">
                    <QRCodeSVG
                        value={qrUrl}
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
        </div>
    );
};

export default QRCode;
