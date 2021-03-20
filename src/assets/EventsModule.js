
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

        this.state = {
            showImageUpload: null,
            file: undefined,
            isImageUploaded: false,
            eventId: null,
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
                    console.log('image uploaded', result);
                    this.setState({
                        isImageUploaded: true,
                    });
                },
                (error) => {
                    console.log('image upload error', error);
                    this.setState({
                        isImageUploaded: false,
                    });
                }
            );
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
                                    {getTime(event.time)} <span>{Date.now() > event.time  + 43200 ? '[ended]' : null}</span>
                                </p>
                                <h3>{event.name}</h3>
                                <h4>{event.subtitle}</h4>
                                <p className="event-venue">{this.props.venue.venueName}</p>
                            </div>
                        </div>
                        <a href="#">Remove this event &raquo;</a> 
                    </div>
                ))}
            </div>
        );
    };

}


export default EventsModule;