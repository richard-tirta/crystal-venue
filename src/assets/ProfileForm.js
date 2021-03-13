
import React from "react";
import VenueForm from "./VenueForm";
import VenueLocation from './form_component/VenueLocation'
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
                    this.setState({
                        isLoaded: true,
                        userid: result.id,
                        username: result.username,
                        discriminator: result.discriminator,
                        avatar: result.avatar,
                        isMember: result.isMember,
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

        const noVenue = (<h4>
            No Venue is listed under your profile.<br />
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
                    {this.state.isAddVenue ? <VenueForm/> : noVenue}
                </div>
            </section>
        );
    };

}


export default ProfileForm;