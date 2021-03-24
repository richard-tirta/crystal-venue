import React from "react";
import ReactDOM from "react-dom";
import ProfileModule from "./ProfileView";


import "./stylesheets/all.scss";


const profileNode = document.getElementById("profile");
const profileNavNode = document.getElementById("profile-nav");

// moreAbout();
ReactDOM.render(<ProfileModule profileNavNode={profileNavNode} />, profileNode);
