
import { data } from "browserslist";
import React from "react";

class VenueModule extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const venue = this.props.venue;
        return (
            <div className="venue-module">
                <div className="venue-description">
                    <div className="venue-desc_about">
                        <h3>{venue.venueName}</h3>
                        <p>{venue.venueDescription}</p>
                        <a href={"https://" + venue.venueWebsite}>{venue.venueWebsite} &raquo;</a>
                    </div>
                    <div className="venue-desc_location">
                        <h4>{venue.venueWorld} | {venue.venueLocation} | Ward {venue.venueWard} | Plot {venue.venuePlot}</h4>
                    </div>
                </div>
                <div className="venue-image">
                    IMAGE
                </div>
            </div>
        );
    };

}


export default VenueModule;