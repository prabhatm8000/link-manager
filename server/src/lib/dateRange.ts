export type DaterangeTypes = "24h" | "7d" | "30d" | "90d" | "1y" | "all";

export const getDaterange = (daterange: DaterangeTypes) => {
    const now = new Date();
    let startDate: Date, endDate: Date;
    switch (daterange) {
        case "24h":
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours in milliseconds
            endDate = now;
            break;
        case "7d":
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds
            endDate = now;
            break;
        case "30d":
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days in milliseconds
            endDate = now;
            break;
        case "90d":
            startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000); // 90 days in milliseconds
            endDate = now;
            break;
        case "1y":
            startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000); // 1 year in milliseconds
            endDate = now;
            break;
        case "all":
            startDate = new Date(0); // Unix epoch start date
            endDate = now;
            break;
        default:
            throw new Error("Invalid date range specified.");
    }

    return { startDate, endDate };
};
