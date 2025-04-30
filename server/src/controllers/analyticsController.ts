import asyncWrapper from "../lib/asyncWrapper";
import { validateObjectId } from "../lib/mongodb";
import analyticsService from "../services/analyticsService";

const getAnalytics = asyncWrapper(async (req, res) => {
    const { linkId, workspaceId, startDate, endDate } = req.query;
    
    validateObjectId(linkId as string);
    validateObjectId(workspaceId as string);

    const analytics = await analyticsService.getAnalyticsByDateRange({
        linkId: linkId as string,
        workspaceId: workspaceId as string,
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
    });

    res.status(200).json({
        success: true,
        message: "",
        data: analytics,
    });
});

const analyticsController = { getAnalytics };
export default analyticsController;
