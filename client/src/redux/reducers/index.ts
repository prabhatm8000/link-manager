import { combineReducers } from "@reduxjs/toolkit";
import user from "./user";
import workspace from "./workspace";

const rootReducer = combineReducers({
    user,
    workspace,
});

export default rootReducer;
