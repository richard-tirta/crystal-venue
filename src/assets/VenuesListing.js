
import React from "react";
import Filter from "./form_component/Filter";
import { DateTime } from "luxon";
import sampleImage from "./images/cva-no-venue.jpg";

class EventsListing extends React.Component {
    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);

        this.state = {
            venues: null,
            events: null,
            filterMusic: false,
            filterFullBar: false,
            filterMusic: false,
            filterNovelties: false,
            filterLgbtq: false,
            filterMature: false,
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
                            venues: result.venues,
                            events: result.events,
                        });
                    },
                    (error) => {
                        console.log('error');
                    }
                )
            })
    }

    handleInputChange(event) {
       
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        this.setState({
            [name]: value,
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
            const event = eventsData.data.filter((venue) => {
                return venue.venueid == parseInt(venue.venueid);
            });

            event.sort((a, b) => {
                return a.time - b.time;
            });
            console.log(event[0].name);
            const eventString = <p><strong>{event[0].name} | {getTime(event[0].time)}</strong></p>
            return eventString;
        }

        return (
            <section>
                 <Filter onChange={this.handleInputChange} />
                {
                    venueData
                        ? venueData.map((venue, index) => (
                            <div className="venue-module" key={'venue' + index}>
                                <div className="venue-description">
                                    <div className="venue-desc_about">
                                        <h3>{venue.name}</h3>
                                        <p dangerouslySetInnerHTML={{ __html: venue.description }} />
                                        <a href={"https://" + venue.venueWebsite}>{venue.website} &raquo;</a>
                                        <p className="venue-desc_type">
                                            {venue.type1} | {venue.type2} | {venue.type3}
                                        </p>
                                        <div>
                                            <p>Next Event:</p>
                                            {findEvent(venue.id)}
                                        </div>
                                    </div>
                                    <div className="venue-desc_location">
                                        <h4>{venue.world} | {venue.location} | Ward {venue.ward} | Plot {venue.plot}</h4>
                                        <p className="venue-desc_aetheryte">
                                            <span className="icon-aetheryte">Nearby Aetheryte Shard:</span>
                                            {venue.aetheryte}
                                        </p>
                                    </div>
                                    
                                </div>
                                <div className="venue-image">
                                    <img src={eventImage(venue.image)} />
                                </div>
                            </div>
                        ))
                        : null
                }
            </section>
        );

    };

}


export default EventsListing;