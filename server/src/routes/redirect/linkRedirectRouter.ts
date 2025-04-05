import { Router } from "express";
import linkRedirectController from "../../controllers/linkRedirectController";

const linkRedirectRouter = Router();

linkRedirectRouter.get(
    "/:shortUrlKey",
    linkRedirectController.redirectToDestination
);

export default linkRedirectRouter;
