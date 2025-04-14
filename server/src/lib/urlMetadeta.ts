import axios from "axios";
import * as cheerio from "cheerio";

const fetchMetadata = async (targetUrl: string) => {
    try {
        const { data } = await axios.get(targetUrl);
        const $ = cheerio.load(data);

        const title = $("title")?.text();
        const description =
            $('meta[name="description"]')?.attr("content") || "";
        const ogImage = $('meta[property="og:image"]')?.attr("content") || "";
        const favicon = $('link[rel="icon"]')?.attr("href") || "";

        return { title, description, previewImg: ogImage, favicon };
    } catch (error) {
        return { title: "", description: "", previewImg: "", favicon: "" };
    }
};

export { fetchMetadata };

