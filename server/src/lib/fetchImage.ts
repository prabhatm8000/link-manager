/**
 * @param url
 * @param alternateUrl - optional alternate URL to fetch the favicon, if the first fetch fails
 * @returns
 */
const fetchImage = async (
    url: string,
    alternateUrl?: string
): Promise<string | undefined> => {
    let base64 = "";
    let contentType = "image/png"; // default content type

    try {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        base64 = Buffer.from(buffer).toString("base64");
        contentType = response.headers.get("content-type") || "image/png";
    } catch (error) {
        if (!alternateUrl) {
            return;
        }
        try {
            const response = await fetch(alternateUrl);
            const buffer = await response.arrayBuffer();
            base64 = Buffer.from(buffer).toString("base64");
            contentType = response.headers.get("content-type") || "image/png";
        } catch (error) {
            return;
        }
    }

    return `data:${contentType};base64,${base64}`;
};

export default fetchImage;
