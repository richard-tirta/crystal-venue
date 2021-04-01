import React from "react";
import { DateTime } from "luxon";
import parse from 'html-react-parser';
import sampleImage from "./images/cva-no-event.jpg";

class EventLightboxView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            venue: null,
        };
    }

    componentDidMount() {
        const cacheData = JSON.parse(localStorage.getItem("cvaVenueData"));
        const cacheTimeStamp = cacheData ? cacheData.timeStamp + 300000 : 0;
        //console.log('EventLightbox View this is cache', cacheData);

        if (cacheTimeStamp < Date.now()) {
            console.log('EventLightbox   grab new data');

            fetch("/venueById?" + new URLSearchParams({
                venueId: this.props.eventData.venueid,
            })).then(response => {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                }
                response.json().then(result => {
                    //console.log('result', result);
                    this.setState({
                        venue: result[0],
                    });
                });
            });
        } else {
            //console.log("EventLightbox  let's use cache");
            const venue = cacheData
                ? cacheData.data.venues.find(
                    (venue) => (venue.id = this.props.eventData.id)
                )
                : null;
            //console.log('hmmm', venue);
            this.setState({
                venue: venue,
            });
        }
    }

    render() {
        const eventData = this.props.eventData;
        const venueData = this.state.venue ? this.state.venue : null;

        const eventImage = (eventImage) => {
            return eventImage ? eventImage : sampleImage;
        };

        const getTime = (data) => {
            const newDate = DateTime.fromMillis(parseInt(data)).toFormat(
                "EEE, MMM. dd | hh:mm a ZZZZ"
            );
            return newDate;
        };

        return (
            <div className="event-lightbox">
                <a href="#" className="lightbox-layer" onClick={this.props.onCloseClick}>Close Lightbox</a>
                <div className="event-item_lightbox">
                    <a href="#" className="lightbox-close" onClick={this.props.onCloseClick}>
                        <span className="icon-x-wt">Close</span>
                    </a>
                    <div className="event-image">
                        <img src={eventImage(eventData.image)} />
                    </div>
                    <div className="event-info-container">
                        <div className="event-description">
                            <p>{getTime(eventData.time)}</p>
                            <h3> {parse(eventData.name)}</h3>
                            <h4> {parse(eventData.subtitle)}</h4>
                            <p className="event-venue">{parse(eventData.venuename)}</p> 
                        </div>
                        {
                            this.state.venue
                                ? (
                                    <div className="venue-description">
                                        <h4>{parse(venueData.name)}</h4>
                                        <a href={'https://' + venueData.website} target="_blank">{venueData.website}</a>
                                        <p>{venueData.world} | {venueData.location} | Ward {venueData.ward} | Plot {venueData.plot}</p>
                                        <p className="venue-desc_aetheryte">
                                            <span className="icon-aetheryte">Nearby Aetheryte Shard:</span>
                                            {venueData.aetheryte}
                                        </p>
                                    </div>
                                )
                                : null
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default EventLightboxView;
