import React from "react";
import Route from "react-router/lib/Route";
import gaSend from "helpers/ga-send"
import Home from "containers/home";

export default (
    <Route path="/" onEnter={gaSend} component={Home}>
    </Route>
);