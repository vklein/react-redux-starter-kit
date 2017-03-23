import {createStore, applyMiddleware, compose} from "redux";
import thunk from "redux-thunk";
import routerMiddleware from "react-router-redux/lib/middleware";
import createLogger from "redux-logger";
import reducer from "../reducers";

export default (initialState = {}, hashHistory) => {
    // ======================================================
    // Middleware Configuration
    // ======================================================
    const middleware = [];
    middleware.push(routerMiddleware(hashHistory));
    middleware.push(thunk);

    // ======================================================
    // Store Enhancers
    // ======================================================
    if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') { // eslint-disable-line
        middleware.push(createLogger({collapsed: true}));
    }

    const enhancers = compose(
        applyMiddleware(...middleware),
        window.devToolsExtension ? window.devToolsExtension() : (f) => f
    );

    // ======================================================
    // Store Instantiation and HMR Setup
    // ======================================================
    const store = createStore(
        reducer,
        initialState,
        enhancers
    );

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextReducer = require('../reducers/index');
            store.replaceReducer(nextReducer);
        });
    }

    return store
}
