import { createClient, type RedisClientType } from "redis";
import envVars from "../constants/envVars";
import consoleColor from "./consoleColor";

let redisclient: RedisClientType = createClient({
    url: envVars.REDIS_URL,
});

export default redisclient;

export const connectToRedis = async () => {
    if (redisclient.isOpen) throw new Error("Redis client already connected");
    await redisclient.connect();
    redisclient.on("connect", () =>
        console.log(consoleColor("Connected to redis", "BgCyan"))
    );
};
