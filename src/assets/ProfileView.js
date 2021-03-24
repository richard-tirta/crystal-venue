
import React from "react";
import ReactDOM from "react-dom";
import ProfileVenueForm from "./ProfileVenueForm";
import ProfileVenueView from "./ProfileVenueView";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { DateTime } from "luxon";
import ErrorBoundary from './ErrorBoundary';

class ProfileModule extends React.Component {
    constructor(props) {
        super(props);

        this.handleIsFormUpdate = this.handleIsFormUpdate.bind(this);
        this.handleBdayForm = this.handleBdayForm.bind(this);
        this.handleBdaySubmit = this.handleBdaySubmit.bind(this);

        this.state = {
            isLoaded: false,
            userid: undefined,
            username: undefined,
            discriminator: undefined,
            birthday: undefined,
            newBirthday: undefined,
            avatar: undefined,
            isMember: false,
            isUserMature: false,
            isAddVenue: false,
            haveVenue: false,
            isFormUpdate: false,
            showBdayForm: false,
            venue: {
                id: undefined,
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
                image: undefined,
                hasEvents: false,
            },
            events: [],
        };

    }

    requestData() {
        fetch('/userInfo')
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
                        let events = this.state.events;

                        const today = new Date();
                        const birthDate = new Date(parseInt(resultData.birthday));
                        let age = today.getFullYear() - birthDate.getFullYear();
                        const month = today.getMonth() - birthDate.getMonth();
                        if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
                            age--;
                        }

                        if (resultData.havevenue) {
                            venue.id = resultData.venue[0].id;
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
                            venue.image = resultData.venue[0].image;
                            venue.haveEvents = resultData.venue[0].haveEvents;
                            if (resultData.venue[0].haveevents) {
                                events = resultData.venue[0].events;
                            }
                        }

                        this.setState({
                            isLoaded: true,
                            userid: resultData.userid,
                            username: resultData.username,
                            discriminator: resultData.discriminator,
                            birthday: resultData.birthday,
                            avatar: resultData.avatar,
                            isMember: resultData.ismember,
                            isUserMature: age >  18 ? true : false,
                            haveVenue: resultData.havevenue,
                            venue,
                            events,
                        });
                    },
                    (error) => {
                        console.log('error');
                        window.location.replace("/");
                    }
                )
            })
    }

    componentDidMount() {
        console.log('ProfileModule componentDidMount');
        this.requestData();
    }

    componentDidUpdate(prevProps) {
        console.log('componentDidUpdate', prevProps);
        //this.requestData();
        if (this.state.isFormUpdate) {
            console.log('form update detected, should check new data');
            console.log('reverting isFormUpdate back to false');

            setTimeout(
                () => {
                    this.requestData();
                    this.setState({
                        isAddVenue: false,
                        isFormUpdate: false,
                    })
                }, 100
            );
        }

        ReactDOM.render(
            <span>
                <strong>{this.state.username ? 'Profile (' + this.state.username + ')' : 'Login'}</strong>
            </span>,
            this.props.profileNavNode
        );
    }

    toggleAddVenue(e) {
        e.preventDefault();
        this.setState({
            isAddVenue: !this.state.isAddVenue
        });
    }

    handleIsFormUpdate(formUpdate) {
        this.setState({
            isFormUpdate: formUpdate,
        });
    }

    handleBdayForm(event) {
        event.preventDefault();
        this.setState({
            showBdayForm: !this.state.showBdayForm,
        });
    }

    handleBdaySubmit(event) {
        event.preventDefault();

        const bdayUTC = this.state.newBirthday.getTime();

        const data = JSON.stringify({
            userId: this.state.userid,
            birthday: bdayUTC,
        });

        console.log('WE ARE READY TO SHIP', data);

        fetch('/updateBday', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: data
        })
            .then(response => response.json())
            .then(
                (result) => {
                    this.setState({
                        isFormUpdate: true,
                        showBdayForm: false,
                    });
                },
                (error) => {
                    console.log('Form is not submitted', error);
                }
            )
    }

    render() {

        const venueStatus = !this.state.haveVenue
            ? (
                <h4>
                    No Venue is listed under your profile.
                </h4>
            )
            : null;

        const bdayForm = this.state.showBdayForm
            ? (
                <form className="bday-form">
                    <DatePicker
                        dateFormat="MMM dd yyyy"
                        maxDate={new Date()}
                        placeholderText="Click to select a date"
                        selected={this.state.newBirthday}
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        onChange={date => this.setState({newBirthday: date })}
                    />
                    <a href="#" id="birthday-cancel" className="bday-button" onClick={this.handleBdayForm}>
                        Cancel
                    </a>
                    <a href="#" id="birthday-save" className="bday-button" onClick={this.handleBdaySubmit}>
                        Save &raquo;
                    </a>
                </form>
            ) : <a href="#" className="edit-button" onClick={this.handleBdayForm}>Add birth date &raquo;</a>;
        
        const getTime = (data) => {
            const newDate = DateTime.fromMillis(parseInt(data)).toFormat('MMMM dd y');
            return newDate;
        }

        return (
            <section className="profile-section">
                <h3>Personal Information:</h3>
                <div className="profile-container">
                    {
                        this.state.userid
                            ? <img className="profile-pic" src={"https://cdn.discordapp.com/avatars/" + this.state.userid + "/" + this.state.avatar + ".png"} />
                            : null
                    }
                    <div>
                        <h3 className="profile-name">{this.state.username}<span>#{this.state.discriminator}</span></h3>
                        {
                            this.state.birthday
                                ? getTime(this.state.birthday)
                                : bdayForm
                        }
                        <p>Role: {this.state.isMember ? 'Member' : 'Guest'}</p>
                    </div>
                </div>
                <div className="venue-container">
                    <h3>Venue Admin:</h3>
                    {
                        this.state.isAddVenue
                            ? <ProfileVenueForm userId={this.state.userid} isUserMature={this.state.isUserMature} isAddVenue={this.state.isAddVenue} isFormUpdate={this.handleIsFormUpdate} />
                            : venueStatus
                    }
                    <a href="#" className="list-venue-link" onClick={(e) => this.toggleAddVenue(e)}>Add a venue to the list&raquo;</a>
                    {
                        this.state.haveVenue
                            ? <ProfileVenueView userId={this.state.userid} isUserMature={this.state.isUserMature} venue={this.state.venue} events={this.state.events} isFormUpdate={this.handleIsFormUpdate} />
                            : null
                    }
                </div>
            </section>
        );
    };

}


export default ProfileModule;