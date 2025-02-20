import mongoose from "mongoose";
import envVars from "../constants/envVars";

export const connectToDB = () => {
    return mongoose.connect(envVars.MONGODB_URI as string);
};
