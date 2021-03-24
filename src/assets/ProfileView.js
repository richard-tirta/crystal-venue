
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
            venues: [],
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
                        let venues = this.state.venues;
                        let events = this.state.events;

                        const today = new Date();
                        const birthDate = new Date(parseInt(resultData.birthday));
                        let age = today.getFullYear() - birthDate.getFullYear();
                        const month = today.getMonth() - birthDate.getMonth();
                        if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
                            age--;
                        }

                        if (resultData.havevenue) {
                            venues = resultData.venue;
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
                            venues,
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
                        this.state.isAddVenue && this.state.isMember
                            ? <ProfileVenueForm userId={this.state.userid} isUserMature={this.state.isUserMature} isAddVenue={this.state.isAddVenue} isFormUpdate={this.handleIsFormUpdate} />
                            : venueStatus
                    }
                    {
                        this.state.isMember
                            ? <a href="#" className="list-venue-link" onClick={(e) => this.toggleAddVenue(e)}>Add a venue to the list&raquo;</a>
                            : <p>You need to be a CVA Discord member to list a venue</p>
                    }
                    {
                        this.state.haveVenue && this.state.isMember
                            ? <ProfileVenueView userId={this.state.userid} isUserMature={this.state.isUserMature} venues={this.state.venues} events={this.state.events} isFormUpdate={this.handleIsFormUpdate} />
                            : null
                    }
                </div>
            </section>
        );
    };

}


export default ProfileModule;