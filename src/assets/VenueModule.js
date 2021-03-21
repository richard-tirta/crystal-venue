
import fetch from "node-fetch";
import React from "react";
import EventForm from "./EventForm";
import EventsModule from "./EventsModule";
import sampleImage from "./images/cva-no-venue.jpg";

class VenueModule extends React.Component {
    constructor(props) {
        super(props);

        this.handleImageEditBtn = this.handleImageEditBtn.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            showImageUpload: false,
            file: undefined,
            isImageUploaded: false,
        }
    }

    handleImageEditBtn(event) {
        event.preventDefault();
        this.setState({
            showImageUpload: !this.state.showImageUpload,
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
        formData.append('id', this.props.venue.id);

        console.log('sending to upload', formData);

        fetch('/uploadVenuePic', {
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

    render() {
        const venue = this.props.venue;
        const venueImage = venue.image ? venue.image : sampleImage;

        const imageUploadEl = (
            <form onSubmit={this.handleSubmit} className="image-upload-form">
                <label>Upload Image</label>
                <input type="file" onChange={this.handleFileChange} />
                <button type="submit" className="form-submit" >Upload</button>
            </form>
        );
        return (
            <div>
                <div className="venue-module">
                    <div className="venue-description">
                        <div className="venue-desc_about">
                            <h3>{venue.venueName}</h3>
                            <p dangerouslySetInnerHTML={{ __html: venue.venueDescription }} />
                            <a href={"https://" + venue.venueWebsite}>{venue.venueWebsite} &raquo;</a>
                            <p className="venue-desc_type">{venue.venueType1} | {venue.venueType2} | {venue.venueType3}
                            </p>
                        </div>
                        <div className="venue-desc_location">
                            <h4>{venue.venueWorld} | {venue.venueLocation} | Ward {venue.venueWard} | Plot {venue.venuePlot}</h4>
                            <p className="venue-desc_aetheryte">
                                <span className="icon-aetheryte">Nearby Aetheryte Shard:</span>
                                {venue.venueAetheryte}
                            </p>
                        </div>
                    </div>
                    <div className="venue-image">
                        {this.state.showImageUpload ? imageUploadEl : null}
                        <img src={venueImage} />
                        <a href="#" className="edit-venue-button" onClick={this.handleImageEditBtn}>Edit Venue Pic &raquo;</a>
                    </div>
                </div>
                
                <div className="event-container">
                    <h3>Event Admin:</h3>
                    {
                        this.props.events
                            ? (
                                <div>
                                    <EventsModule
                                        userId={this.props.userid} venue={this.props.venue} events={this.props.events} isFormUpdate={this.props.isFormUpdate}
                                    />
                                    <p><strong>Add an Event</strong></p>
                                    <EventForm userId={this.props.userid} venue={this.props.venue} isFormUpdate={this.props.isFormUpdate} />
                                </div>
                            )
                            : "No Event is listed under your Venue."}
                </div>
            </div>
        );
    };

}


export default VenueModule;