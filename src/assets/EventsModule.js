
import { Firehose } from "aws-sdk";
import fetch from "node-fetch";
import React from "react";
import { DateTime } from "luxon";
import sampleImage from "./images/cva-no-venue.jpg";

class EventsModule extends React.Component {
    constructor(props) {
        super(props);

        this.handleImageEditBtn = this.handleImageEditBtn.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRemoveEvent = this.handleRemoveEvent.bind(this);
        this.handleRemoveWarning = this.handleRemoveWarning.bind(this);

        this.state = {
            showImageUpload: null,
            file: undefined,
            isImageUploaded: false,
            eventId: null,
            showDeleteWarning: false,
        }
    }

    handleImageEditBtn(event, index, eventId) {
        event.preventDefault();
        this.setState({
            showImageUpload: index,
            eventId: eventId,
        })
    }

    handleFileChange(event) {
        const file = event.target.files;
        event.preventDefault();
        this.setState({
            file: file
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        if (!this.state.file) {
            throw new Error('Select a file first!');
        }
        const formData = new FormData();
        formData.append('file', this.state.file[0]);
        formData.append('id', this.state.eventId);

        console.log('sending to upload', formData);

        fetch('/uploadEventPic', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(
                (result) => {
                    console.log('event uploaded', result);
                    this.setState({
                        isImageUploaded: true,
                    });
                    this.props.isFormUpdate(true);
                },
                (error) => {
                    console.log('image upload error', error);
                    this.setState({
                        isImageUploaded: false,
                    });
                }
            );
    }

    handleRemoveEvent(event, eventId, venueId, eventsCount) {
        event.preventDefault();

        console.log('removeEvent', event, eventId, venueId, eventsCount);

        const data = JSON.stringify({
            eventId: eventId,
            venueId: venueId,
            eventsCount: eventsCount,
        });

        fetch('/deleteEvent', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'DELETE',
            body: data
        })
            .then(response => response.json())
            .then(
                (result) => {
                    console.log('event deleted', result);
                    this.props.isFormUpdate(true);
                    this.setState({
                        showDeleteWarning: !this.state.showDeleteWarning,
                    });
                },
                (error) => {
                    console.log('event delete error', error);
                }
            );
    }

    handleRemoveWarning(event) {
        event.preventDefault();
        this.setState({
            showDeleteWarning: !this.state.showDeleteWarning,
        });
    }

    render() {
        const eventImage = (eventImage) => {
            return eventImage ? eventImage : sampleImage;
        };

        const getTime = (data) => {
            const newDate = DateTime.fromMillis(parseInt(data)).toFormat('EEE, MMM. dd | hh:mm a ZZZZ');
            return newDate;
        }

        const imageUploadEl = (
            <form onSubmit={this.handleSubmit} className="image-upload-form">
                <label>Upload Image</label>
                <input type="file" onChange={this.handleFileChange} />
                <button type="submit" className="form-submit" >Upload</button>
            </form>
        );

        return (
            <div className="events-module">
                {this.props.events.map((event, index) => (
                    <div key={'event' + index}>
                        <div className="event-item">
                            <div className="event-image">
                                {this.state.showImageUpload === index ? imageUploadEl : null}
                                <a href="#" className="edit-venue-button" onClick={e => this.handleImageEditBtn(e, index, event.id)}>Edit Event Pic &raquo;</a>
                                <img src={eventImage(event.image)} />
                            </div>
                            <div className="event-description">
                                <p>
                                    <span className={Date.now() - 43200 > event.time ? 'event-ended' : null}>
                                    {getTime(event.time)}</span> {Date.now() - 43200 > event.time ? <small>Completed</small> : null}
                                </p>
                                <h3>{event.name}</h3>
                                <h4>{event.subtitle}</h4>
                                <p className="event-venue">{this.props.venue.venueName}</p>
                            </div>
                        </div>
                        <a href="#" onClick={e => this.handleRemoveWarning(e)}>Remove this event &raquo;</a>
                        {
                            this.state.showDeleteWarning
                                ? (
                                    <div className="lightbox">
                                        <h3>
                                            Are you sure you want to remove <br />
                                            {event.name}<br />
                                            from CVA listing?
                                        </h3>
                                        <button onClick={e => this.handleRemoveEvent(e, event.id, this.props.venue.id, this.props.events.length)} className="form-submit">
                                            Yes, remove this event.
                                        </button>
                                        <button onClick={e => this.handleRemoveWarning(e)} className="form-submit">
                                            No, keep this event.
                                        </button>
                                    </div>
                                )
                                : null
                        }
                    </div>
                ))}
            </div>
        );
    };

}


export default EventsModule;