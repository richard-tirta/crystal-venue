import React from "react";
import ReactDOM from "react-dom";
import VenuesListing from "./VenuesListing";

import "./stylesheets/all.scss";

const venueNode = document.getElementById("venues");
const profileNavNode = document.getElementById("profile-nav");

// moreAbout();
ReactDOM.render(<VenuesListing profileNavNode={profileNavNode} />, venueNode);
