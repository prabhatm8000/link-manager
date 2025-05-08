import { combineReducers } from "@reduxjs/toolkit";
import analytics from "./analytics";
import events from "./events";
import links from "./links";
import usage from "./usage";
import user from "./user";
import workspace from "./workspace";

const rootReducer = combineReducers({
    user,
    workspace,
    links,
    events,
    analytics,
    usage,
});

export default rootReducer;
