import mongoose from "mongoose";
import envVars from "../constants/envVars";
import { APIResponseError } from "../errors/response";

export const connectToDB = () => {
    const mongo = mongoose.connect(envVars.MONGODB_URI as string);
    // mongo
    //     .then((o) =>
    //         o.connection.db?.collection("users")?.dropIndex("name_1")
    //     )
    //     .then((_) => console.log("done"));
    return mongo;
};

export const disconnectFromDB = () => mongoose.disconnect();

/**
 * 
 * @param id 
 * @returns true or throws APIResponseError
 */
export const validateObjectId = (...ids: string[] | number[] | mongoose.Types.ObjectId[]): boolean => {
    if (!ids.length) throw new Error("At least one id is required");
    for (const id of ids) {
        const isValid = mongoose.Types.ObjectId.isValid(id);
        if (!isValid) throw new APIResponseError("Something went wrong", 400, false);
    }
    return true;
};
