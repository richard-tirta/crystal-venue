
import fetch from "node-fetch";
import React from "react";
import EventForm from "./EventForm";
import EventsModule from "./EventsModule";
import sampleImage from "./images/cva-no-venue.jpg";
import loadingImage from "./images/icon-loading.gif";

class VenueModule extends React.Component {
    constructor(props) {
        super(props);

        this.handleImageEditBtn = this.handleImageEditBtn.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRemoveVenue = this.handleRemoveVenue.bind(this);
        this.handleRemoveWarning = this.handleRemoveWarning.bind(this);

        this.state = {
            showImageUpload: false,
            isImageUploading: false,
            file: undefined,
            showDeleteWarning: null,
            errors: {
                imageForm: '',
            }
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
        let errors = this.state.errors;
        event.preventDefault();
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
        formData.append('id', this.props.venue.id);

        console.log('sending to upload', formData);

        this.setState({
            isImageUploading: true,
        });

        fetch('/uploadVenuePic', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(
                (result) => {
                    console.log('image uploaded', result);
                    this.setState({
                        isImageUploading: false,
                        showImageUpload: false,
                    });
                    this.props.isFormUpdate(true);
                },
                (error) => {
                    console.log('image upload error', error);
                }
            );
    }

    handleRemoveVenue(event, venueId) {
        event.preventDefault();

        const data = JSON.stringify({
            venueId: venueId,
            userId: this.props.userId,
        });

        console.log('ready to delete venue', data);

        fetch('/deleteVenue', {
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
                        showDeleteWarning: null,
                    });
                },
                (error) => {
                    console.log('event delete error', error);
                }
            );
    }

    handleRemoveWarning(event, venueId) {
        event.preventDefault();
        console.log('handleRemoveWarning', event, venueId);
        this.setState({
            showDeleteWarning: venueId,
        });
    }

    render() {
        const venue = this.props.venue;
        const venueImage = venue.image ? venue.image : sampleImage;

        const imageUploadEl = !this.state.isImageUploading
            ? (
                <div className="image-upload-form_container">
                    <form onSubmit={this.handleSubmit} className="image-upload-form">
                        <label>Upload Image</label>
                        <p>
                            Image needs to be in 3:2 aspect ratio (eg: 1800x1200) and not over 5MB in size.
                        </p>
                        {this.state.errors.imageForm.length > 0 && <span className='form-error'>{this.state.errors.imageForm}</span>}
                        <input type="file" accept=".jpg, .jpeg, .webp" onChange={this.handleFileChange} />
                        <button type="submit" className="form-submit" >Upload</button>
                            </form>
                </div>
            ) : (
                <div className="image-upload-loading">
                    <img className="loading-gif" src={loadingImage}/>
                    <h3>Uploading Image. Please Wait.</h3>
                </div>
            );
        
            const deleteLightbox = (venueId, venueName,) => {
                return (
                    <div className="lightbox">
                        <h3>
                            Are you sure you want to remove <br />
                            <span className="warning-yellow">{venueName}</span><br />
                            from CVA listing?
                        </h3>
                        <p className="warning-yellow">
                            <strong>
                                This will also remove all events <br />
                                associated with the venue!
                            </strong>
                        </p>
                        <button onClick={e => this.handleRemoveVenue(e, venueId)} className="form-submit">
                             Yes, remove this venue.
                        </button>
                        <button onClick={e => this.handleRemoveWarning(e)} className="form-submit">
                             No, keep this venue.
                        </button>
                    </div>
                )
            }
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
                <div className="remove-link-container">
                    <a href="#" onClick={e => this.handleRemoveWarning(e, venue.id)}>Remove this venue &raquo;</a>
                </div>
                {
                    this.state.showDeleteWarning
                        ? deleteLightbox(venue.id, venue.venueName)
                        : null
                }
                

                <div className="event-container">
                    <h3>Event Admin:</h3>
                    <EventsModule
                        userId={this.props.userid} venue={this.props.venue} events={this.props.events} isFormUpdate={this.props.isFormUpdate}
                    />
                    <p><strong>Add an Event</strong></p>
                    <EventForm userId={this.props.userId} isUserMature={this.props.isUserMature} venue={this.props.venue} isFormUpdate={this.props.isFormUpdate} />
                </div>
            </div>
        );
    };

}


export default VenueModule;