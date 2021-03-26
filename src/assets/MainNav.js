import React, { useCallback, useState, useEffect } from "react";

export default function MainNav(props) {
    const [menuIsOpen, handleHamburgerClick] = useState(null);

    return (
        <React.Fragment>
            <div className="hamburger-container">
                <button
                    className={menuIsOpen ? 'hamburger hamburger--spin is-active' : 'hamburger hamburger--spin'}
                    type="button"
                    onClick={e => { e.preventDefault(); handleHamburgerClick(!menuIsOpen) }}
                >
                    <span className="hamburger-box">
                        <span className="hamburger-inner"></span>
                    </span>
                </button>
            </div>
            <div className={menuIsOpen ? 'profile-nav  is-active' : 'profile-nav '} id="profile-nav">
                <a href={props.data.userData.userName ? '/profile.html' : '/profile'}>
                    {props.data.userData.userName ? 'Profile (' + props.data.userData.userName+ ')' : 'Login'}
                </a>
            </div>
            <nav className={menuIsOpen ? 'is-active' : ''}>
                <span id="nav-event" className="selected nav-link">Events</span>
                <a className="nav-link" href="/venue.html" id="nav-venue">Venues</a>
                <a className="nav-link" href="/about.html" id="nav-about">About</a>
            </nav>
        </React.Fragment>  
    )
}
