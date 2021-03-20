import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";



class EventForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            eventName: '',
            eventSubTitle: '',
            eventTime: '',
            eventIsMature: false,
            isFormSubmitted: false,
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
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
            eventName: this.state.eventName,
            eventSubTitle: this.state.eventSubTitle,
            eventTime: eventTimeUTC,
            eventIsMature: this.state.eventIsMature,
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
                        isFormSubmitted: true,
                    });
                },
                (error) => {
                    console.log('Form is not submitted', error);
                    this.setState({
                        isFormSubmitted: false,
                    });
                }
            )
    }

    render() {
        if (this.state.isFormSubmitted) {
            return (<h2>Event has been submitted</h2>);
        }
        return (
            <form>
                <div className="column-container">
                    <div className="form-column">
                        <label htmlFor="eventName">Event Name*</label>
                        <input type="text" id="event-form_name" className="form-input" name="eventName" minLength="3" maxLength="35" placeholder="Event Name" required onChange={this.handleInputChange} />

                        <label htmlFor="eventSubtitle">Event SubTitle</label>
                        <input type="text" id="event-form_subtitle" className="form-input" name="eventSubTitle" minLength="3" maxLength="35" placeholder="Event SubTitle" required onChange={this.handleInputChange} />     
                    </div>
                    <div className="form-column">
                        <label htmlFor="eventWorld">Event Date*</label>
                        <DatePicker
                            showTimeSelect
                            dateFormat="EE, dd-MM-yyyy. hh:mm a"
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
                <a href="#" id="submit-cta"
                    className="form-submit"
                    onClick={this.handleSubmit}>
                    Submit New Event
                    </a>
            </form>
        );
    }
}

export default EventForm;