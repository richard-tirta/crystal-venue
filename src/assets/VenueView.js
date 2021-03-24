
import React from "react";
import ReactDOM from "react-dom";
import Filter from "./form_component/Filter";
import { DateTime } from "luxon";
import sampleImage from "./images/cva-no-venue.jpg";

class VenueView extends React.Component {
    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleCloseAgeGate = this.handleCloseAgeGate.bind(this);

        this.state = {
            userName: undefined,
            userIsMature: undefined,
            venues: null,
            events: null,
            filterMusic: false,
            filterFullBar: false,
            filterMusic: false,
            filterNovelties: false,
            filterLgbtq: false,
            filterMature: false,
            showAgeGate: false,
        }
    }

    componentDidMount() {
        console.log('VenuesListing componentDidMount');
        fetch('/allVenues')
            .then(response => {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                }
                response.json().then(
                    (result) => {
                        console.log(result);
                        
                        this.setState({
                            venues: result.data.venues,
                            events: result.data.events,
                            userName: result.userData.userName,
                            userIsMature: result.userData.userIsMature,
                        });
                    },
                    (error) => {
                        console.log('error');
                    }
                )
            })
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
            console.log('zzzzz', venueId)
            if (!eventsData) {
                return null;
            }
            
            const event = eventsData.filter((venue) => {
                return venue.venueid == venueId
            })

            event.length > 0 ? event.sort((a, b) => {
                return a.time - b.time;
            }) : null;

            const eventString = event.length > 0
                ? <div className="venue-desc_next-event">
                    <p>Next Event:</p>
                    <p>{event[0].name} | {getTime(event[0].time)}</p>
                </div>
                : null;
            return eventString;
        }

        const ageGate = (
            <div className="lightbox age-gate">
                <a href="#" onClick={this.handleCloseAgeGate}>[Close]</a>
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

        return (
            <div>
                <Filter onChange={this.handleInputChange} filterMature={this.state.filterMature} />
                {this.state.showAgeGate ? ageGate : null}
                <section className="venues-listing_container">
                {
                    venueData
                        ? venueData.map((venue, index) => (
                            <div className="venue-module" key={'venue' + venue.id}>
                                 <div className="venue-image">
                                    <img src={eventImage(venue.image)} />
                                </div>
                                <div className="venue-description">
                                    <div className="venue-desc_about">
                                        <h3>{venue.name}</h3>
                                        <p className="venue-desc_type">
                                            {venue.type1} | {venue.type2} | {venue.type3}
                                        </p>
                                        {venue.website ?  <a href={venue.website} className="venue-desc_website">{venue.website} &raquo;</a> : null}
                                        {eventsData.length > 0 ? findEvent(venue.id) : null}
                                    </div>
                                    <div className="venue-desc_location">
                                        <h4>{venue.world} | {venue.location} | Ward {venue.ward} | Plot {venue.plot}</h4>
                                        <p className="venue-desc_aetheryte">
                                            <span className="icon-aetheryte">Nearby Aetheryte Shard:</span>
                                            {venue.aetheryte}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                        : null
                    }
                    </section>
            </div>
        );

    };

}


export default VenueView;