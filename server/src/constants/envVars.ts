import { config } from "dotenv";

config();
const envVars = {
    NODE_ENV: process.env.NODE_ENV,
    DEV_CLIENT_URL: process.env.DEV_CLIENT_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    EMAIL: process.env.EMAIL,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
};

export default envVars;
