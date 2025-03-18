import { combineReducers } from "@reduxjs/toolkit";
import user from "./user";
import workspace from "./workspace";
import links from "./links";
const rootReducer = combineReducers({
    user,
    workspace,
    links,
});

export default rootReducer;
