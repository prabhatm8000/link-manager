import TitleText from "@/components/TitleText";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import LoadingCircle from "@/components/ui/LoadingCircle";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const LinkPassword = () => {
    const [searchParams, _] = useSearchParams();
    const [loading, setLoading] = useState<boolean>(false);
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const entries = [...formData.entries()];
        const data = Object.fromEntries(entries);

        const shortUrl = searchParams.get("surl");
        setLoading(false);
        window.location.href = `${shortUrl}?p=${data.password}`;
    };

    return (
        <div className="flex items-center justify-center h-screen w-screen p-4">
            <Card className="w-full min-w-xs max-w-sm">
                <CardHeader className="text-center">
                    <CardTitle>
                        <TitleText>Password</TitleText>
                    </CardTitle>
                    <CardDescription>
                        Link is protected with password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={onSubmit}
                        className="w-full flex flex-col gap-6 justify-center"
                    >
                        <div className="relative">
                            <Input name="password" type="password" autoFocus />
                            {searchParams.get("error") === "true" && (
                                <span className="absolute top-full text-xs text-red-500">
                                    * Incorrect password or something went
                                    wrong.
                                </span>
                            )}
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex gap-2 justify-center items-center"
                        >
                            {loading && <LoadingCircle className="size-5" />}
                            <span>Access</span>
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default LinkPassword;
