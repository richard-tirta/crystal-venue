import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";



class ProfileEventForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCloseAgeGate = this.handleCloseAgeGate.bind(this);

        this.state = {
            eventName: '',
            eventSubTitle: '',
            eventTime: '',
            eventIsMature: false,
            showAgeGate: false,
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        if (name === "eventIsMature" && value && !this.props.isUserMature) {
            this.setState({
                showAgeGate: true,
            });
            return;
        }

        this.setState({
            [name]: value,
        });
    }

    handleSubmit(event) {
        event.preventDefault();

        const eventTimeUTC = this.state.eventTime.getTime();

        const data = JSON.stringify({
            userId: this.props.userId,
            venueId: this.props.venue.id,
            venueName: this.props.venue.venueName,
            eventName: this.state.eventName,
            eventSubTitle: this.state.eventSubTitle,
            eventTime: eventTimeUTC,
            eventIsMature: this.state.eventIsMature,
            eventType1: this.props.venue.type1,
            eventType2: this.props.venue.type2,
            eventType3: this.props.venue.type3,
        });

        console.log('WE ARE READY TO SHIP', data);

        fetch('/addEvent', {
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
                        eventName: '',
                        eventSubTitle: '',
                        eventTime: '',
                        eventIsMature: false,
                    });
                    this.props.isFormUpdate(true);
                },
                (error) => {
                    console.log('Form is not submitted', error);
                }
            )
    }

    handleCloseAgeGate(event) {
        event.preventDefault();
        this.setState({
            showAgeGate: false,
        });
    }

    render() {
        const ageGate = (
            <div className="lightbox age-gate">
                <a href="#" onClick={this.handleCloseAgeGate} className="icon-x-wt lightbox-close">
                    Close
                </a>
                <h3>
                        You need to be at least 18 years old<br />
                        to list a Mature event.
                     </h3>
                    <p>
                       Make sure your Birth date is set<br/> at the Personal Information section above.
                    </p>
            </div>
        );

        return (
            <form onSubmit={this.handleSubmit}>
                {this.state.showAgeGate ? ageGate : null}
                <p className="text-right"><span className="blue-baby">*</span> required</p>
                <div className="column-container">
                    <div className="form-column">
                        <label htmlFor="eventName">Event Name<span className="blue-baby">*</span></label>
                        <input type="text" id="event-form_name" className="form-input" name="eventName" minLength="3" maxLength="35" placeholder="Event Name" required onChange={this.handleInputChange} />

                        <label htmlFor="eventSubtitle">Event SubTitle</label>
                        <input type="text" id="event-form_subtitle" className="form-input" name="eventSubTitle" minLength="3" maxLength="35" placeholder="Event SubTitle" required onChange={this.handleInputChange} />     
                    </div>
                    <div className="form-column">
                        <label htmlFor="eventWorld">Event Date<span className="blue-baby">*</span></label>
                        <DatePicker
                            showTimeSelect
                            dateFormat="EE, MMM dd yyyy. hh:mm a"
                            placeholderText="Click to select a date"
                            minDate={new Date()}
                            selected={this.state.eventTime}
                            onChange={event => this.setState({ eventTime: event })}
                        />
                        <div className="form-checkbox-container">
                            <label htmlFor="eventIsMature">Mature (18+)</label>
                            <input className="form-checkbox" type="checkbox" id="event-form_mature" name="eventIsMature" onChange={this.handleInputChange} />
                        </div>
                    </div>
                </div>
                <button href="#" id="submit-cta" className="form-submit">
                    Submit New Event
                </button>
            </form>
        );
    }
}

export default ProfileEventForm;