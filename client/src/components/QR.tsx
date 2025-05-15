import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { useRef, useState } from "react";
import { FiDownload } from "react-icons/fi";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";

const QR = ({ url, logoUrl }: { url: string; logoUrl?: string }) => {
    const qrUrl = `${url}?qr=yes`;
    const [branding, setBranding] = useState<boolean>(false);
    const imgUrl = branding ? logoUrl : undefined;
    const qrRef = useRef<HTMLDivElement>(null);

    const downloadQRCode = () => {
        if (!qrRef?.current) return;
        const canvas = qrRef.current.getElementsByTagName("canvas")?.[0];
        const url = canvas?.toDataURL("image/png");
        if (!url) return;

        const a = document.createElement("a");
        a.href = url;
        a.download = `qr-code-${qrUrl}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div>
            <div className="flex items-center justify-between">
                <Label>QR Code</Label>
                <div className="flex items-center gap-1">
                    <Label
                        htmlFor="qr-code-branding"
                        className="text-xs text-muted-foreground"
                    >
                        Branding
                    </Label>
                    <Switch
                        id="qr-code-branding"
                        checked={branding}
                        onCheckedChange={() => setBranding((p) => !p)}
                    />
                </div>
            </div>
            <div className="overflow-hidden relative mt-2 flex flex-col justify-center items-center w-full h-24 bg-inherit rounded-md border border-ring/50">
                <div className="absolute z-20 top-0 right-0 m-1">
                    <Button
                        type="button"
                        variant={"outline"}
                        size={"icon"}
                        onClick={downloadQRCode}
                        className="text-muted-foreground"
                    >
                        <FiDownload />
                    </Button>
                </div>
                <div className="absolute z-20">
                    <QRCodeSVG
                        value={qrUrl}
                        height={80}
                        width={80}
                        bgColor="var(--background)"
                        fgColor="var(--accent-foreground)"
                        imageSettings={{
                            src: imgUrl || "/logo.svg",
                            height: 32,
                            width: 32,
                            excavate: true,
                            // crossOrigin: "anonymous",
                        }}
                    />
                </div>
            </div>
            <div ref={qrRef} className="">
                <QRCodeCanvas
                    hidden={true}
                    value={qrUrl}
                    size={320}
                    imageSettings={{
                        src: imgUrl || "/logo.svg",
                        height: 50,
                        width: 50,
                        excavate: true,
                        // crossOrigin: "anonymous",
                    }}
                />
            </div>
        </div>
    );
};

export default QR;
