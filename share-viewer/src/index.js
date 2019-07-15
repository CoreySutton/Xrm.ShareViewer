import "babel-polyfill";
import "./index.css";
import "bootstrap/dist/css/bootstrap.css";
import React from "react";
import ReactDOM from "react-dom";
import ShareViewer from "./Components/ShareViewer";

window.addEventListener("load", function onLoad() {
    ReactDOM.render(<ShareViewer />, document.getElementById("root"));
});
