import cors from "cors";
import express, { Express } from "express";
import { connectToDB } from "./lib/mongodb";
import router from "./routes/router";
import envVars from "./constants/envVars";
import cookieParser from "cookie-parser";

const app: Express = express();
const PORT = envVars.PORT;
const NODE_ENV = envVars.NODE_ENV;

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: NODE_ENV === "dev" ? envVars.DEV_CLIENT_URL : "",
        credentials: true,
    })
);

app.use("/api/v1", router);

app.listen(PORT, () => {
    connectToDB()
        .catch((err) => {
            console.log(err);
            process.exit(1);
        })
        .finally(() =>
            console.log(`Connected to DB\nServer running on port ${PORT}`)
        );
});
