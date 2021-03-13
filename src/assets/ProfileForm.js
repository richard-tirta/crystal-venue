
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
                venueAetheryte: undefined,
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
                        const resultData = result[0];
                        let venue = this.state.venue;

                        if (resultData.havevenue) {
                            console.log('whyy', resultData.venue[0]);
                            venue.venueName = resultData.venue[0].name;
                            venue.venueDescription = resultData.venue[0].description;
                            venue.venueWorld = resultData.venue[0].world;
                            venue.venueLocation = resultData.venue[0].location;
                            venue.venueWard = resultData.venue[0].ward;
                            venue.venuePlot = resultData.venue[0].plot;
                            venue.venueAetheryte = resultData.venue[0].aetheryte;
                            venue.venueWebsite = resultData.venue[0].website;
                            venue.venueType1 = resultData.venue[0].type1;
                            venue.venueType2 = resultData.venue[0].type2;
                            venue.venueType3 = resultData.venue[0].type3;
                            venue.isMature = resultData.venue[0].ismature;
                        }

                        console.log('hmmm', resultData);

                        this.setState({
                            isLoaded: true,
                            userid: resultData.userid,
                            username: resultData.username,
                            discriminator: resultData.discriminator,
                            avatar: resultData.avatar,
                            isMember: resultData.ismember,
                            haveVenue: resultData.havevenue,
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

        const venueStatus = !this.state.haveVenue
            ? (
                <h4>
                    No Venue is listed under your profile."<br />
                    <a href="#" onClick={(e) => this.toggleAddVenue(e)}>List a Venue &raquo;</a>
                </h4>
            )
            : (
                <a href="#">Add an Event &raquo;</a>
            );

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