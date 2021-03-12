
import React from "react";
import VenueLocation from './form_component/VenueLocation'
import ErrorBoundary from './ErrorBoundary'

class ProfileForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };

    }

    componentDidMount() {
        const urlParams = new URLSearchParams(window.location.search);
        const myParam = urlParams.get('code');
        const fragment = new URLSearchParams(window.location.hash.slice(1));
        const accessToken = fragment.get("access_token");
        const tokenType = fragment.get("token_type");
        const DISCORD_CLIENT_ID = '819420216583913532';
        const DISCORD_CLIENT_SECRET = 'whvp1V0pnXoMsm6O1zFqAQ4l8IDvBMB5';
        console.log(myParam, accessToken, tokenType);

        if (myParam) {
            fetch('/discord?code=' + myParam)
                .then(response => response.json())
                .then(
                    (result) => {
                        console.log(result);
                    },
                    (error) => {
                        console.log('error');
                    }
            )

            //https://discord.com/api/oauth2/authorize?client_id=819420216583913532&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fprofile&response_type=code&scope=identify%20guilds

            // {
            //     headers: new Headers({
            //         client_id: DISCORD_CLIENT_ID,
            //         client_secret: DISCORD_CLIENT_SECRET,
            //         code: myParam,
            //         scope: "identify guilds",
            //         grantType: "authorization_code",
            //         redirectUri: "https:localhost:3000/profile"
            //     })
            // }

            // fetch('https://discord.com/api/oauth2/token', {
            //     headers: {
            //         client_id: DISCORD_CLIENT_ID,
            //         client_secret: DISCORD_CLIENT_SECRET,
            //         code: myParam,
            //         scope: "identify guilds",
            //         grantType: "authorization_code",
            //         redirectUri: "https:localhost:3000/profile"
            //     }
            //     })
            //     .then(response => response.json()) 
            //     .then(json => console.log(json))
            //     .catch(err => console.log(err));

        }
    }

    render() {
        return (<div>
        </div>);
    };

}


export default ProfileForm;