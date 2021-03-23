import React from "react";
import ReactDOM from "react-dom";
import EventsListing from "./EventsListing";


import "./stylesheets/all.scss";

const eventsNode = document.getElementById("events");
const profileNavNode = document.getElementById("profile-nav");

console.log('hello world');

ReactDOM.render(<EventsListing profileNavNode={profileNavNode} />, eventsNode);

