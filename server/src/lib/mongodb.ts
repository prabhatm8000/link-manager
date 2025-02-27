import mongoose from "mongoose";
import envVars from "../constants/envVars";

export const connectToDB = () => {
    const mongo = mongoose.connect(envVars.MONGODB_URI as string);
    // mongo
    //     .then((o) =>
    //         o.connection.db?.collection("workspaces")?.dropIndex("team_1")
    //     )
    //     .then((_) => console.log("done"));
    return mongo;
};
