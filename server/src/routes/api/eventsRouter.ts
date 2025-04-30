import { Router } from "express";
import eventsController from "../../controllers/eventsController";

const eventsRouter = Router();

eventsRouter.get("/:workspaceId", eventsController.getEvents);

eventsRouter.get("/event/:eventId", eventsController.getEventById);

export default eventsRouter;
