import { Router } from "express";
import linkRedirectRouter from "./linkRedirectRouter";

const redirectRouter = Router();
redirectRouter.use("/", linkRedirectRouter);

export default redirectRouter;