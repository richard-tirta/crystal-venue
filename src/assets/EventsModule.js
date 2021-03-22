
import { Firehose } from "aws-sdk";
import fetch from "node-fetch";
import React from "react";
import { DateTime } from "luxon";
import sampleImage from "./images/cva-no-venue.jpg";
import loadingImage from "./images/icon-loading.gif";

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
            isImageUploading: false,
            file: undefined,
            eventId: null,
            showDeleteWarning: null,
            errors: {
                imageForm: '',
            }
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
        let errors = this.state.errors;
        event.preventDefault();
        console.log('file size', event.target.files[0].size);
        if (file[0].size > 5000000) {
            errors.imageForm = 'Image is too big. Please resize it below 5MB.'
        }
        this.setState({
            file: file,
            errors: errors
        });
    }

    handleSubmit(event) {
        let errors = this.state.errors;

        event.preventDefault();

        if (!this.state.file) {
            errors.imageForm = 'Please select a file to upload'
            this.setState({
                errors: errors,
            });
            return;
        } else if (errors.imageForm) {
            return;
        }

        const formData = new FormData();
        formData.append('file', this.state.file[0]);
        formData.append('id', this.state.eventId);

        console.log('sending to upload', formData);

        this.setState({
            isImageUploading: true,
        });

        fetch('/uploadEventPic', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(
                (result) => {
                    console.log('event uploaded', result);
                    this.setState({
                        showImageUpload: null,
                        isImageUploading: false,
                    });
                    this.props.isFormUpdate(true);
                },
                (error) => {
                    console.log('image upload error', error);
                }
            );
    }

    handleRemoveEvent(event, eventId, venueId, eventsCount) {
        event.preventDefault();

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

    handleRemoveWarning(event, index) {
        event.preventDefault();
        console.log('handleRemoveWarning', event);
        this.setState({
            showDeleteWarning: index,
        });
    }

    render() {
        const imageUploadEl = !this.state.isImageUploading
            ? (
            <form onSubmit={this.handleSubmit} className="image-upload-form">
                <label>Upload Image</label>
                {this.state.errors.imageForm.length > 0 && <span className='form-error'>{this.state.errors.imageForm}</span>}
                <input type="file" accept=".jpg, .jpeg, .webp" onChange={this.handleFileChange} />
                <button type="submit" className="form-submit" >Upload</button>
            </form>
            ) : (
                <div className="image-upload-loading">
                    <img className="loading-gif" src={loadingImage}/>
                    <h3>Uploading Image. Please Wait.</h3>
                </div>
        ) ;

        const eventImage = (eventImage) => {
            return eventImage ? eventImage : sampleImage;
        };

        const getTime = (data) => {
            const newDate = DateTime.fromMillis(parseInt(data)).toFormat('EEE, MMM. dd | hh:mm a ZZZZ');
            return newDate;
        }

        const deleteLightbox = (eventId, eventName, venueId, eventLength, index) => {
            return (
                <div className="lightbox">
                    <h3>
                        Are you sure you want to remove <br />
                        {eventName}<br />
                        from CVA listing?
                    </h3>
                    <button onClick={e => this.handleRemoveEvent(e, eventId, venueId, eventLength)} className="form-submit">
                         Yes, remove this event.
                    </button>
                    <button onClick={e => this.handleRemoveWarning(e)} className="form-submit">
                         No, keep this event.
                    </button>
                </div>
            )
        }

        //if event is older than 12h, mark that as complete.
        return (
            <div className="events-module">
                {
                    this.props.events.length > 0
                        ? this.props.events.map((event, index) => {
                            const eventId = event.id;
                            const eventname = event.name;
                            return (
                                <div key={'event' + index}>
                                    <div className="event-item">
                                        <div className="event-image">
                                            {this.state.showImageUpload === index ? imageUploadEl : null}
                                            <a href="#" className="edit-venue-button" onClick={e => this.handleImageEditBtn(e, index, event.id)}>
                                                Edit Event Pic &raquo;
                                            </a>
                                            <img src={eventImage(event.image)} />
                                        </div>
                                        <div className="event-description">
                                            <p>
                                                <span className={Date.now() - 3600000 > event.time ? 'event-ended' : null}>
                                                    {getTime(event.time)}</span> {Date.now() - 3600000 > event.time ? <small>Completed</small> : null}
                                            </p>
                                            <h3>{event.name}</h3>
                                            <h4>{event.subtitle}</h4>
                                            <p className="event-venue">{this.props.venue.venueName}</p>
                                        </div>
                                    </div>
                                    <a href="#" onClick={e => this.handleRemoveWarning(e, index)}>Remove this event &raquo;</a>
                                    {
                                        this.state.showDeleteWarning == index
                                            ? deleteLightbox(eventId, eventname, event.venueId, this.props.events.length, index)
                                            : null
                                    }
                                </div>
                            )
                        })
                        : <h4>No Event is listed under your Venue.</h4>
                }
            </div>
        );
    };

}


export default EventsModule;