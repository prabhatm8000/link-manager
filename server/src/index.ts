import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Express } from "express";
import envVars from "./constants/envVars";
import { connectToDB } from "./lib/mongodb";
import router from "./routes/router";

const app: Express = express();
const PORT = envVars.PORT;
const CLIENT_URL = envVars.CLIENT_URL;

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: CLIENT_URL,
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
