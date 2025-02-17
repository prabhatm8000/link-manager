import cors from "cors";
import express, { Express } from "express";
import { connectToDB } from "./lib/mongodb";
import router from "./routes/router";
import { configDotenv } from "dotenv";

configDotenv();

const app: Express = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);
app.use(router);

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
