import { Router, type Request, type Response } from "express";
import { apiErrorHandler, APIResponseError } from "../../errors/response";
import asyncWrapper from "../../lib/asyncWrapper";
import analyticsRouter from "./analyticsRouter";
import eventsRouter from "./eventsRouter";
import linksRouter from "./linksRouter";
import usersRouter from "./usersRouter";
import workspacesRouter from "./workspacesRouter";

const apiRouter = Router();

// testing route
apiRouter.get(
    "/",
    asyncWrapper(async (req: Request, res: Response) => {
        res.status(200).json({
            message: "Welcome to the API!",
            success: true,
            data: {
                name: "API",
                version: "1.0.0",
                description: "API working fine.",
            },
        });
    })
);
apiRouter.use("/user", usersRouter);
apiRouter.use("/workspace", workspacesRouter);
apiRouter.use("/link", linksRouter);
apiRouter.use("/event", eventsRouter);
apiRouter.use("/analytic", analyticsRouter);

// invalid route
apiRouter.use("/*", (req: Request, res: Response) => {
    throw new APIResponseError(
        {
            title: "Attempt to access invalid route",
            description: "This route does not exist",
        },
        404,
        false
    );
});

// error handler
apiRouter.use(apiErrorHandler);

export default apiRouter;
