
import React, { useEffect, useState, useContext } from "react";
import ReactDOM from "react-dom";
import EventLightboxView from "./EventLightboxView";
import Filter from "./form_component/Filter";
import HelperFilter from "./HelperFilter";
import parse from 'html-react-parser';
import { DateTime } from "luxon";
import sampleImage from "./images/cva-no-event.jpg";

import { EventContext } from './EventContext';

export default function EventView(props) {
    //const contextData= useContext(EventContext);
    const [data, setData] = useContext(EventContext);
    console.log('hmmm', data);
    const [filters, setFilters] = useState({
        filterMusic: false,
        filterFullBar: false,
        filterFood: false,
        filterNovelties: false,
        filterSports: false,
        filterLgbtq: false,
        filterMature: false,
    })
    const [showEventLightbox, setEventLightbox] = useState(null);

    useEffect(() => {
        const cacheData = JSON.parse(localStorage.getItem('cvaEventsData'));
        const cacheTimeStamp = cacheData ? cacheData.timeStamp + 300000 : 0;
        const urlParams = new URLSearchParams(window.location.search);
        const urlEventId = urlParams.get('eid');
        setEventLightbox(urlEventId ? parseInt(urlEventId) : null);

        //console.log('EVENTVIEW USE EFFECTS');

        const processData = (result) => {
            //sort by event time
            const resultByEventTime = result.eventsData.slice(0);
            resultByEventTime.sort((a, b) => {
                return a.time - b.time;
            });
            console.log('hello from eventview useffect', result);

            setData({
                userName: result.userData.userName,
                userIsMature: result.userData.isUserMature,
                filterMature: result.userData.isUserMature,
                events: resultByEventTime,
            });
        }

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

                            processData(result);
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
            processData(cacheData);
        }
    },[]);

    const handleInputChange = (event) => {

        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        if (name === "filterMature" && value && !data.userIsMature) {
            setAgeGate(true)
            return;
        }

        setFilters({
            [name]: value,
        });
    }

    const handleCloseAgeGate = (event) => {
        event.preventDefault();
        setAgeGate(false);
    }

    const handleEventElClick = (event, eventId) => {
        event.preventDefault();
        setEventLightbox(eventId);
    }

    const handlePopularityClick = (event, eventId) => {
        event.preventDefault();
    }

    const eventData = data.events;
    const eventImage = (eventImage) => {
        return eventImage ? eventImage : sampleImage;
    };

    const getTime = (data) => {
        const newDate = DateTime.fromMillis(parseInt(data)).toFormat('EEE, MMM. dd | hh:mm a ZZZZ');
        return newDate;
    }

    const ageGate = (
        <div className="lightbox age-gate">
            <a href="#" onClick={e => handleCloseAgeGate(e)} className="icon-x-wt lightbox-close">
                Close
            </a>
            <h3>
                You need to be at least 18 years old<br />
                    to activate this filter.
                    </h3>
            <p>
                Go to <a href="/profile">Profile Page &raquo;</a><br />
                    to make sure your birth date is set.
                </p>
        </div>
    );

    const eventModule = (cvaEvent) => {
        return (
            <div key={'event' + cvaEvent.id}>
                {showEventLightbox === cvaEvent.id ? <EventLightboxView eventData={cvaEvent} onCloseClick={e => handleEventElClick(e, null)} /> : null}
                <article role="article" className="event-item" onClick={e => handleEventElClick(e, cvaEvent.id)} >
                    <div className="event-image">
                        <img src={eventImage(cvaEvent.image)} />
                    </div>
                    <div className="event-info-container">
                        <div className="event-description">
                            <p>
                                {getTime(cvaEvent.time)}
                            </p>
                            <h3>{parse(cvaEvent.name)}</h3>
                            <h4>{parse(cvaEvent.subtitle)}</h4>
                            <p className="event-venue">{parse(cvaEvent.venuename)}</p>
                        </div>
                        <div className="event-star">
                            {/* <span className="icon-star-stroke icon-star">Star</span> */}
                        </div>
                    </div>
                </article>
            </div>
        )
    }
    return (
        <div>
            <Filter onChange={e => handleInputChange(e)} filterMature={filters.filterMature} />
            {data.showAgeGate ? ageGate : null}
            <section className="events-module">
                {
                    eventData
                        ? eventData.map((cvaEvent, index) => (
                            HelperFilter(filters, cvaEvent) && Date.now() - 3600000 < cvaEvent.time ? eventModule(cvaEvent) : null
                        ))
                        : null
                }
            </section>
        </div>
    );
}