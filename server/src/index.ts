import cookieParser from "cookie-parser";
import express, { Express } from "express";
import { corsConfig, rateLimiter } from "./constants/configs";
import envVars from "./constants/envVars";
import consoleColor from "./lib/consoleColor";
import { connectToDB } from "./lib/mongodb";
import router from "./routes/router";

const app: Express = express();
const PORT = parseInt(envVars.PORT as string);

// for prod, ui files will be served by express, so it'll be [same-site]
if (envVars.NODE_ENV === "dev") {
    app.use(corsConfig);

    // log requests
    app.use(function(req, res, next) {
        console.log(
            consoleColor(
                `${req.method} ${req.protocol}://${req.get(
                    "host"
                )}${req.originalUrl}`,
                "FgCyan"
            )
        );
        next();
    })
}

app.use(rateLimiter);
app.use(express.json());
app.use(cookieParser());
app.use(router);

app.listen(PORT, "0.0.0.0", () => {
    connectToDB()
        .catch((err) => {
            console.log(err);
            process.exit(1);
        })
        .finally(() => {
            console.log(consoleColor("Connected to database", "BgYellow"));
            console.log(
                consoleColor(`Server running on port ${PORT}`, "BgBlue")
            );
        });
});
