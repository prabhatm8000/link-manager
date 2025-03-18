import cookieParser from "cookie-parser";
import express, { Express } from "express";
import { corsConfig, rateLimiter } from "./constants/configs";
import envVars from "./constants/envVars";
import consoleColor from "./lib/consoleColor";
import { connectToDB } from "./lib/mongodb";
import router from "./routes/router";

const app: Express = express();
const PORT = envVars.PORT;

app.use(rateLimiter);
app.use(express.json());
app.use(cookieParser());
app.use(corsConfig);
app.use("/api/v1", router);

app.listen(PORT, () => {
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
