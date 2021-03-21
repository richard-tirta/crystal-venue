import React from "react";
import ReactDOM from "react-dom";
import EventsListing from "./EventsListing";


import "./stylesheets/all.scss";

const eventsNode = document.getElementById("events");

console.log('hello world');

ReactDOM.render(<EventsListing/>, eventsNode);

