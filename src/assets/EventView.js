
import React from "react";
import ReactDOM from "react-dom";
import EventLightboxView from "./EventLightboxView";
import Filter from "./form_component/Filter";
import HelperFilter from "./HelperFilter";
import parse from 'html-react-parser';
import { DateTime } from "luxon";
import sampleImage from "./images/cva-no-event.jpg";

class EventView extends React.Component {
    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleCloseAgeGate = this.handleCloseAgeGate.bind(this);
        this.handleEventElClick = this.handleEventElClick.bind(this);
        this.handlePopularityClick = this.handlePopularityClick.bind(this);

        this.state = {
            userName: undefined,
            userIsMature: undefined,
            events: null,
            filterMusic: false,
            filterFullBar: false,
            filterFood: false,
            filterNovelties: false,
            filterSports: false,
            filterLgbtq: false,
            filterMature: false,
            showAgeGate: false,
            showEventLightbox: null,
        }
    }

    componentDidMount() {
        const cacheData = JSON.parse(localStorage.getItem('cvaEventsData'));
        const cacheTimeStamp = cacheData ? cacheData.timeStamp + 300000 : 0;
        const urlParams = new URLSearchParams(window.location.search);
        const urlEventId = urlParams.get('eid');
        console.log('this is cache', cacheData);
        //console.log('eid is', myParam);

        const processData = (result) => {
            //sort by event time
            const resultByEventTime = result.eventsData.slice(0);
            resultByEventTime.sort((a, b) => {
                return a.time - b.time;
            });

            this.setState({
                userName: result.userData.userName,
                userIsMature: result.userData.isUserMature,
                filterMature: result.userData.isUserMature,
                events: resultByEventTime,
                showEventLightbox: urlEventId ? parseInt(urlEventId) : null,
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


    }

    componentDidUpdate() {
        ReactDOM.render(
            <a href={this.state.userName ? '/profile.html' : '/profile'}>
                {this.state.userName ? 'Profile (' + this.state.userName + ')' : 'Login'}
            </a>,
            this.props.profileNavNode
        );
    }

    handleInputChange(event) {

        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        if (name === "filterMature" && value && !this.state.userIsMature) {
            this.setState({
                showAgeGate: true,
            });
            return;
        }

        this.setState({
            [name]: value,
        });
    }

    handleCloseAgeGate(event) {
        event.preventDefault();
        this.setState({
            showAgeGate: false,
        });
    }

    handleEventElClick(event, eventId) {
        event.preventDefault();
        this.setState({
            showEventLightbox: eventId,
        })
    }

    handlePopularityClick(event, eventId) {
        event.preventDefault();
    }

    render() {
        const eventData = this.state.events;
        const eventImage = (eventImage) => {
            return eventImage ? eventImage : sampleImage;
        };

        const getTime = (data) => {
            const newDate = DateTime.fromMillis(parseInt(data)).toFormat('EEE, MMM. dd | hh:mm a ZZZZ');
            return newDate;
        }

        const ageGate = (
            <div className="lightbox age-gate">
                <a href="#" onClick={this.handleCloseAgeGate} className="icon-x-wt lightbox-close">
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
                    {this.state.showEventLightbox === cvaEvent.id ? <EventLightboxView eventData={cvaEvent} onCloseClick={e => this.handleEventElClick(e, null)} /> : null}
                    <article role="article" className="event-item" onClick={e => this.handleEventElClick(e, cvaEvent.id)} >
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
                <Filter onChange={this.handleInputChange} filterMature={this.state.filterMature} />
                {this.state.showAgeGate ? ageGate : null}
                <section className="events-module">
                    {
                        eventData
                            ? eventData.map((cvaEvent, index) => (
                                HelperFilter(this.state, cvaEvent) ? eventModule(cvaEvent) : null
                            ))
                            : null
                    }
                </section>
            </div>
        );

    };

}


export default EventView;