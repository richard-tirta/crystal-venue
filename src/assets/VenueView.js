
import React from "react";
import ReactDOM from "react-dom";
import Filter from "./form_component/Filter";
import HelperFilter from "./HelperFilter";
import parse from 'html-react-parser';
import { DateTime } from "luxon";
import sampleImage from "./images/cva-no-venue.jpg";
import { cache } from "browserslist";

class VenueView extends React.Component {
    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleCloseAgeGate = this.handleCloseAgeGate.bind(this);
        this.handleShowDescription = this.handleShowDescription.bind(this);

        this.state = {
            userName: undefined,
            userIsMature: undefined,
            venues: null,
            events: null,
            filterMusic: false,
            filterFullBar: false,
            filterFood: false,
            filterNovelties: false,
            filterSports: false,
            filterLgbtq: false,
            filterMature: false,
            showAgeGate: false,
            showDescription: null,
        }
    }

    componentDidMount() {
        const cacheData = JSON.parse(localStorage.getItem('cvaVenueData'));
        const cacheTimeStamp = cacheData ? cacheData.timeStamp + 300000 : 0;
        console.log('this is cache', cacheData);

        const processData = (result) => {
            this.setState({
                venues: result.data.venues,
                events: result.data.events,
                userName: result.userData.userName,
                userIsMature: result.userData.isUserMature,
                filterMature : result.userData.isUserMature,
            });
        }

        if (cacheTimeStamp < Date.now()) {
            fetch('/allVenues')
            .then(response => {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                }
                response.json().then(
                    (result) => {
                        const cacheData = result;
                        cacheData.timeStamp = Date.now();
                        console.log(result);

                        processData(result);
                        // save this in local storage
                        localStorage.removeItem('cvaVenueData');
                        localStorage.setItem('cvaVenueData', JSON.stringify(cacheData));
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
            <a href={this.state.userName ? '/profile.html' : '/profile' }>
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

    handleShowDescription(event, venueId) {
        event.preventDefault();
        this.setState({
            showDescription: this.state.showDescription ? null : venueId,
        });
    }

    render() {
        const venueData = this.state.venues;
        const eventsData = this.state.events;

        const eventImage = (eventImage) => {
            return eventImage ? eventImage : sampleImage;
        };

        const getTime = (data) => {
            const newDate = DateTime.fromMillis(parseInt(data)).toFormat('EEE, MMM. dd | hh:mm a ZZZZ');
            return newDate;
        }

        const findEvent = (venueId) => {
            if (!eventsData) {
                return null;
            }
            
            let event = eventsData.filter((venue) => {
                return venue.venueid == venueId
            })


            event.length > 0 ? event.sort((a, b) => {
                if (a.time > b.time && Date.now() - 3600000 < b.time ) {
                    return 1;
                } else {
                    return -1;
                }
            }) : null;


            const eventString = event.length > 0 && Date.now() - 3600000 < event[0].time 
                ? <div className="venue-desc_next-event">
                    <p>Next Event:</p>
                    <p><span>{parse(event[0].name)}</span> | {getTime(event[0].time)}</p>
                </div>
                : null;
            return eventString;
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
                        Go to <a href="/profile">Profile Page &raquo;</a><br/>
                        to make sure your birth date is set.
                    </p>
            </div>
        );

        const venueModule = (venue) => {
            return (
                <div className="venue-module" key={'venue' + venue.id}>
                    <div className="venue-image">
                    <img src={eventImage(venue.image)} />
                </div>
                <div className="venue-description">
                    <div className="venue-desc_about">
                        <h3>{parse(venue.name)}</h3>
                        <a href="#" className="venue-desc_description-link" onClick={e => this.handleShowDescription(e, venue.id)}>
                                Description
                            <span className={this.state.showDescription === venue.id ? "icon-arrow-r-wt is-active" : "icon-arrow-r-wt" }>
                                    &rsaquo;
                            </span>
                        </a>
                        <p className="venue-desc_type">
                            {venue.type1} {venue.type2 ? '|' : null} {venue.type2} {venue.type3 ? '|' : null} {venue.type3}
                        </p>
                        {venue.website ?  <a href={'https://' + parse(venue.website)} className="venue-desc_website" target="_blank">{parse(venue.website)} &raquo;</a> : null}
                        {eventsData.length > 0 ? findEvent(venue.id) : null}
                    </div>
                    <div className="venue-desc_location">
                        <h4>{venue.world} | {venue.location} | Ward {venue.ward} | Plot {venue.plot}</h4>
                        <p className="venue-desc_aetheryte">
                            <span className="icon-aetheryte">Nearby Aetheryte Shard:</span>
                            {venue.aetheryte}
                        </p>
                        </div>
                        <div className={this.state.showDescription === venue.id ? "venue-description_text is-active" : "venue-description_text" }>
                            <p>{parse(venue.description)}</p>
                        </div>
                </div>
            </div>
            )
        }

        return (
            <div>
                <Filter onChange={this.handleInputChange} filterMature={this.state.filterMature} />
                {this.state.showAgeGate ? ageGate : null}
                <section className="venues-listing_container">
                {
                    venueData
                        ? venueData.map((venue, index) => (
                            HelperFilter(this.state, venue) ? venueModule(venue) : null
                        ))
                        : null
                    }
                    </section>
            </div>
        );

    };

}


export default VenueView;