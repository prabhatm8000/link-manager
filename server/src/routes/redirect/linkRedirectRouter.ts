import { Router } from "express";
import { shortUrlKeyLength } from "../../constants/configs";
import linkRedirectController from "../../controllers/linkRedirectController";
import uaMiddleware from "../../middlewares/UAMiddleware";

const linkRedirectRouter = Router();

linkRedirectRouter.get(
    `/:shortUrlKey([a-zA-Z0-9]{${shortUrlKeyLength}})`,
    uaMiddleware,
    linkRedirectController.redirectToDestination
);

export default linkRedirectRouter;
