
import { data } from "browserslist";
import React from "react";
import sampleImage from "./images/sample/eagle-dragon.jpg";

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
                        <p dangerouslySetInnerHTML={{__html: venue.venueDescription}}/>
                        <a href={"https://" + venue.venueWebsite}>{venue.venueWebsite} &raquo;</a>
                    </div>
                    <div className="venue-desc_location">
                        <h4>{venue.venueWorld} | {venue.venueLocation} | Ward {venue.venueWard} | Plot {venue.venuePlot}</h4>
                    </div>
                </div>
                <div className="venue-image">
                    <img src={sampleImage}/>
                </div>
            </div>
        );
    };

}


export default VenueModule;