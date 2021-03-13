
import React from "react";
import VenueForm from "./VenueForm";
import VenueModule from "./VenueModule";
import ErrorBoundary from './ErrorBoundary'

class ProfileForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            userid: undefined,
            username: undefined,
            discriminator: undefined,
            avatar: undefined,
            isMember: false,
            isAddVenue: false,
            haveVenue: false,
            venue: {
                venueName: undefined,
                venueDescription: undefined,
                venueWorld: undefined,
                venueLocation: undefined,
                venueWard: undefined,
                venuePlot: undefined,
                venueWebsite: undefined,
                venueType1: undefined,
                venueType2: undefined,
                venueType3: undefined,
                isMature: false,
            }
        };

    }

    componentDidMount() {
        console.log('ProfileForm componentDidMount');
        fetch('/discord')
            .then(response => {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                }
                response.json().then(
                    (result) => {
                        console.log(result);
                        let venue = this.state.venue;
                        let haveVenue = false;

                        if (result.venue) {
                            haveVenue = true;
                            venue.venueName = result.venue.venueName;
                            venue.venueDescription = result.venue.venueDescription;
                            venue.venueWorld = result.venue.venueWorld;
                            venue.venueLocation = result.venue.venueLocation;
                            venue.venueWard = result.venue.venueWard;
                            venue.venuePlot = result.venue.venuePlot;
                            venue.venueWebsite = result.venue.venueWebsite;
                            venue.venueType1 = result.venue.venueType1;
                            venue.venueType2 = result.venue.venueType2;
                            venue.venueType3 = result.venue.venueType3;
                            venue.isMature = result.venue.isMature;
                        }

                        this.setState({
                            isLoaded: true,
                            userid: result.id,
                            username: result.username,
                            discriminator: result.discriminator,
                            avatar: result.avatar,
                            isMember: result.isMember,
                            haveVenue: haveVenue,
                            venue,
                        });
                    },
                    (error) => {
                        console.log('error');
                        window.location.replace("/");
                    }
                )
            })
    }

    toggleAddVenue(e) {
        e.preventDefault();
        this.setState({
            isAddVenue: !this.state.isAddVenue
        });
    }

    render() {

        const venueStatus = (<h4>
            {this.state.haveVenue ? "No Venue is listed under your profile." : null }<br />
            <a href="#" onClick={(e) => this.toggleAddVenue(e)}>List a Venue &raquo;</a>
        </h4>);

        return (
            <section className="profile-section">
                <h3>Personal Information:</h3>
                <div className="profile-container">
                    <img className="profile-pic" src={"https://cdn.discordapp.com/avatars/" + this.state.userid + "/" + this.state.avatar + ".png"} />
                    <div>
                        <h3 className="profile-name">{this.state.username}<span>#{this.state.discriminator}</span></h3>
                        <p>Role: {this.state.isMember ? 'Member' : 'Guest'}</p>
                    </div>
                </div>
                <div class="venue-container">
                    <h3>Venue Admin:</h3>
                    {this.state.haveVenue ? <VenueModule venue={this.state.venue} /> : null}
                    {this.state.isAddVenue ? <VenueForm userId={this.state.userid} isAddVenue={this.state.isAddVenue} /> : venueStatus}
                </div>
            </section>
        );
    };

}


export default ProfileForm;