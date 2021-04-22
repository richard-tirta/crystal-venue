import React, {useContext } from "react";
import ReactDOM from "react-dom";
import EventView from "./EventView";
import NavProfileView from "./NavProfileView";
import { EventProvider } from './EventContext';


import "./stylesheets/all.scss";

const eventsNode = document.getElementById("events");
const profileNavNode = document.getElementById("profile-nav");

ReactDOM.render(
    <EventProvider>
        <NavProfileView/>
    </EventProvider>,
    profileNavNode
);

ReactDOM.render(
    <EventProvider>
        <EventView profileNavNode={profileNavNode} />
    </EventProvider>,
    eventsNode
);

