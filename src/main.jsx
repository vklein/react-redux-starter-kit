import "babel-polyfill";
import React from "react";
import {render} from "react-dom";
import syncHistoryWithStore from "react-router-redux/lib/sync";
import {hashHistory} from "react-router";
import routes from "./router/routes";
import AppContainer from "containers/appContainer";
import createStore from "store/createStore";
import {loadState} from "helpers/localStorage";

// ========================================================
// Store Instantiation
// ========================================================
const initialState = window.__initialState || {};
const localStorageState = loadState();
const state = {...initialState, ...localStorageState};
const store = createStore(state, hashHistory);
const history = syncHistoryWithStore(hashHistory, store);

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root');


function start() {
    render(
        <AppContainer history={history} store={store} routes={routes}/>,
        MOUNT_NODE
    )
}


// ========================================================
// Go!
// ========================================================
start();