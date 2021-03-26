import React, { useCallback, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import MainNav from "./MainNav";
import EventView from "./EventView";


import "./stylesheets/all.scss";

const mainApp = () => {
    const navNode = document.getElementById('navigation');
    const eventsNode = document.getElementById('events');
    //const profileNavNode = document.getElementById('profile-nav');

    const cacheData = JSON.parse(localStorage.getItem('cvaEventsData'));
    const cacheTimeStamp = cacheData ? cacheData.timeStamp + 30000 : 0;
    console.log('this is cache', cacheData);

    if (cacheTimeStamp < Date.now()) {
        console.log('grab new data');
        fetch('/allEvents')
            .then(response => {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                }
                response.json().then(
                    (result) => {
                        console.log(result);
                        const cacheData = result;
                        cacheData.timeStamp = Date.now();

                        ReactDOM.render(<MainNav data={result} />, navNode);
                        ReactDOM.render(<EventView navNode={navNode} data={result} />, eventsNode);

                        // save this in local storage
                        localStorage.removeItem('cvaEventsData');
                        localStorage.setItem('cvaEventsData', JSON.stringify(cacheData));
                    },
                    (error) => {
                        console.log('error');
                    }
                )
            })
    } else {
        console.log("let's use cache");
        ReactDOM.render(<MainNav data={cacheData} />, navNode);
        ReactDOM.render(<EventView navNode={navNode} data={cacheData} />, eventsNode);
    }
    
}

mainApp();




