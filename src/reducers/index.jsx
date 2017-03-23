import data from "./data";
import {combineReducers} from "redux";
import {routerReducer} from "react-router-redux";

const appReducer = combineReducers({
    data,
    routing: routerReducer,
});

export default appReducer;