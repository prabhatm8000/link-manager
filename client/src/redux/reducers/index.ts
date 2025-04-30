import { combineReducers } from "@reduxjs/toolkit";
import events from "./events";
import links from "./links";
import user from "./user";
import workspace from "./workspace";

const rootReducer = combineReducers({
    user,
    workspace,
    links,
    events,
});

export default rootReducer;
