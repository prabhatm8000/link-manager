import StatusMessagesMark4 from "../constants/messages";
import { APIResponseError } from "../errors/response";
import asyncWrapper from "../lib/asyncWrapper";
import { validateObjectId } from "../lib/mongodb";
import eventsService from "../services/eventsService";

const statusMessgaes = new StatusMessagesMark4("events");

const getEvents = asyncWrapper(async (req, res) => {
    const { workspaceId } = req.params;
    validateObjectId(workspaceId as string);

    const { linkId, type, fetchRange = "24h" } = req.query;
    const limit = Number(req.query.limit) || 10;
    const skip = Number(req.query.skip) || 0;

    const events = await eventsService.getEventsByWorkspaceId({
        workspaceId: workspaceId as string,
        linkId: linkId as string,
        type: type as string,
        fetchRange,
        limit,
        skip,
    });

    res.status(200).json({
        success: true,
        message: "",
        data: events,
    });
});
const getEventById = asyncWrapper(async (req, res) => {
    const { eventId } = req.params;
    validateObjectId(eventId as string);

    const event = await eventsService.getEventById(eventId as string);
    if (!event) {
        throw new APIResponseError(
            statusMessgaes.getMessage("Event not found", "error", "other"),
            404,
            false
        );
    }
    res.status(200).json({
        success: true,
        message: "",
        data: event,
    });
});

const eventsController = { getEvents, getEventById };
export default eventsController;
