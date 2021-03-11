import React from "react";
import ReactDOM from "react-dom";
import ProfileForm from "./ProfileForm";


import "./stylesheets/all.scss";


const profileNode = document.getElementById("profile");

console.log('hello');

// moreAbout();
ReactDOM.render(<ProfileForm />, profileNode);
