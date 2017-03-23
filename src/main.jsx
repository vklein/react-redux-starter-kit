import "babel-polyfill";
import React from "react";
import {render} from "react-dom";
import syncHistoryWithStore from "react-router-redux/lib/sync";
import hashHistory from "react-router/lib/hashHistory";
import routes from "./router/routes";
import AppContainer from "containers/appContainer";
import createStore from "store/createStore";

// ========================================================
// Store Instantiation
// ========================================================
const initialState = window.__initialState;
const store = createStore(initialState, hashHistory);
const history = syncHistoryWithStore(hashHistory, store);

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root');


function start() {
    render(
        <AppContainer history={history} store={store} routes={routes} />,
        MOUNT_NODE
    )
}



// ========================================================
// Go!
// ========================================================
start();