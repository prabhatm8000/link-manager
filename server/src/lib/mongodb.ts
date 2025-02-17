import mongoose from "mongoose";

export const connectToDB = () => {
    return mongoose.connect(process.env.MONGODB_URI as string);
};
