import React from "react";
import ReactDOM from "react-dom";
import ProfileModule from "./ProfileModule";


import "./stylesheets/all.scss";


const profileNode = document.getElementById("profile");

console.log('hello');

// moreAbout();
ReactDOM.render(<ProfileModule />, profileNode);
