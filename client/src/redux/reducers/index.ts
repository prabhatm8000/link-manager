import { combineReducers } from "@reduxjs/toolkit";
import analytics from "./analytics";
import events from "./events";
import links from "./links";
import user from "./user";
import workspace from "./workspace";

const rootReducer = combineReducers({
    user,
    workspace,
    links,
    events,
    analytics
});

export default rootReducer;
