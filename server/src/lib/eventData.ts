import type { Request } from "express";
import { UAParser } from "ua-parser-js";

export const getUserAgent = (req: Request) => {
    const parser = new UAParser(req.headers["user-agent"]);
    const ua = parser.getResult();
    return ua;
};

export type GeoLocationType = {
    status?: string;
    country?: string;
    region?: string;
    city?: string;
};

export const getGeoLocation = async (
    ip: string
): Promise<GeoLocationType | null> => {
    try {
        const geoRes = await fetch(
            `http://ip-api.com/json/${ip}?fields=status,country,regionName,city`
        );
        const geoData = await geoRes.json();
        geoData['region'] = geoData['regionName'];
        return geoData.status !== "success" ? null : geoData;
    } catch (error) {
        console.log(`Error getting geo location for ${ip}`, error);
        return null;
    }
};
