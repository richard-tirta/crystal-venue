import React from "react";
import ReactDOM from "react-dom";
import EventView from "./EventView";


import "./stylesheets/all.scss";

const eventsNode = document.getElementById("events");
const profileNavNode = document.getElementById("profile-nav");

ReactDOM.render(<EventView profileNavNode={profileNavNode} />, eventsNode);

