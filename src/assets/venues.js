import React from "react";
import ReactDOM from "react-dom";
import VenueView from "./VenueView";

import "./stylesheets/all.scss";

const venueNode = document.getElementById("venues");
const profileNavNode = document.getElementById("profile-nav");

// moreAbout();
ReactDOM.render(<VenueView profileNavNode={profileNavNode} />, venueNode);
