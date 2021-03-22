import React from "react";
import ReactDOM from "react-dom";
import VenuesListing from "./VenuesListing";

import "./stylesheets/all.scss";

const venueNode = document.getElementById("venues");

// moreAbout();
ReactDOM.render(<VenuesListing/>, venueNode);
