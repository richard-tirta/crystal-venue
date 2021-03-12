
import React from "react";
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
        };

    }

    componentDidMount() {
        const urlParams = new URLSearchParams(window.location.search);
        const myParam = urlParams.get('code');

        console.log('HMMMM');

        fetch('/discord')
            .then(response => response.json())
            .then(
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
                }
        )
    }

    render() {
        //const avatar = isLoaded ? <img src={"https://cdn.discordapp.com/avatars/" + this.state.id + "/" + this.state.avatar + ".png"} /> : null;
        return (
            <section className="profile-section">
                <h2>Personal Information:</h2>
                <div className="profile-container">
                    <div>
                        <img src={"https://cdn.discordapp.com/avatars/" + this.state.userid + "/" + this.state.avatar + ".png"} />
                    </div>
                    <div>
                        <h3>{this.state.username}<span>{this.state.discriminator}</span></h3>
                        <p>Birthday</p>
                        <p>Role: { this.state.isMember ? 'Member' : 'Guest'}</p>
                    </div>
                </div>
            </section>
        );
    };

}


export default ProfileForm;