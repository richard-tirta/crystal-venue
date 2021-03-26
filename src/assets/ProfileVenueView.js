
import fetch from "node-fetch";
import React from "react";
import ProfileVenueUpdateForm from "./ProfileVenueUpdateForm";
import ProfileEventForm from "./ProfileEventForm";
import ProfileEventView from "./ProfileEventView";
import sampleImage from "./images/cva-no-venue.jpg";
import loadingImage from "./images/icon-loading.gif";

class ProfileVenueView extends React.Component {
    constructor(props) {
        super(props);

        this.handleImageEditBtn = this.handleImageEditBtn.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRemoveVenue = this.handleRemoveVenue.bind(this);
        this.handleRemoveWarning = this.handleRemoveWarning.bind(this);
        this.handleEditVenue = this.handleEditVenue.bind(this);

        this.state = {
            showImageUpload: null,
            isImageUploading: false,
            file: undefined,
            showDeleteWarning: null,
            showEditVenue: null,
            venueId: null,
            errors: {
                imageForm: '',
            }
        }
    }

    handleImageEditBtn(event, index, venueId) {
        event.preventDefault();
        this.setState({
            showImageUpload: index,
            venueId: venueId,
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
        formData.append('id', this.state.venueId);

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

    handleRemoveVenue(event, venueId, venueCount) {
        event.preventDefault();

        const data = JSON.stringify({
            venueId: venueId,
            userId: this.props.userId,
            venueCount: venueCount,
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
                    this.setState({
                        showDeleteWarning: null,
                    });
                    this.props.isFormUpdate(true);
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

    handleEditVenue(event, venueId) {
        event ? event.preventDefault() : null;
        this.setState({
            showEditVenue: venueId,
        });
    }

    render() {
        const venues = this.props.venues;

        const venueImage = (venueImage) => {
            return venueImage ? venueImage : sampleImage;
        };

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
                    <img className="loading-gif" src={loadingImage} />
                    <h3>Uploading Image. Please Wait.</h3>
                </div>
            );

        const deleteLightbox = (venueId, venueName, venueLength, index) => {
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
                    <button onClick={e => this.handleRemoveVenue(e, venueId, venueLength)} className="form-submit">
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
                {
                    venues.sort((a, b) => {return a.id - b.id}).map((venue, index) => (
                        <div key={'venue' + venue.id}>
                            <div className="venue-module">
                                <div className="venue-image">
                                    {this.state.showImageUpload === index ? imageUploadEl : null}
                                    <img src={venueImage(venue.image)} />
                                    <a href="#" className="edit-venue-button" onClick={e => this.handleImageEditBtn(e, index, venue.id)}>
                                        Edit Venue Pic &raquo;
                                </a>
                                </div>
                                <div className="venue-description">
                                    <div className="venue-desc_about">
                                        <h3>{venue.name}</h3>
                                        <p dangerouslySetInnerHTML={{ __html: venue.description }} />
                                        <p className="venue-desc_type">
                                            {venue.type1}
                                            {venue.type2 ? '|' : null} {venue.type2}
                                            {venue.type3 ? '|' : null} {venue.type3}
                                        </p>
                                        {venue.website ? <a href={"https://" + venue.website} target="_blank">{venue.website} &raquo;</a> : null}

                                    </div>
                                    <div className="venue-desc_location">
                                        <h4>{venue.world} | {venue.location} | Ward {venue.ward} | Plot {venue.plot}</h4>
                                        <p className="venue-desc_aetheryte">
                                            <span className="icon-aetheryte">Nearby Aetheryte Shard:</span>
                                            {venue.aetheryte}
                                        </p>
                                    </div>
                                </div>
                                <div className="remove-link-container">
                                    <a href="#" onClick={e => this.handleEditVenue(e, venue.id)}>Edit this venue &raquo;</a>
                                    <a href="#" onClick={e => this.handleRemoveWarning(e, venue.id)}>Remove this venue &raquo;</a>
                                </div>
                            </div>
                            {
                                this.state.showDeleteWarning == venue.id
                                    ? deleteLightbox(venue.id, venue.name, venues.length, index)
                                    : null
                            }
                            {
                                this.state.showEditVenue == venue.id
                                    ? <ProfileVenueUpdateForm
                                        userId={this.props.userId}
                                        venueId={venue.id}
                                        isUserMature={this.props.isUserMature}
                                        venue={venue}
                                        isFormUpdate={this.props.isFormUpdate}
                                        onFormSubmitted={e => this.handleEditVenue(e, null)}
                                    />
                                    : null
                            }
                            <div className="event-container">
                                <h3>Event Admin ({venue.name}):</h3>
                                {venue.events
                                    ? <ProfileEventView
                                        userId={this.props.userId}
                                        venue={venue}
                                        events={venue.events}
                                        isFormUpdate={this.props.isFormUpdate}
                                    />
                                    : null}
                                <p><strong>Add an Event</strong></p>
                                <ProfileEventForm
                                    userId={this.props.userId}
                                    isUserMature={this.props.isUserMature}
                                    venue={venue}
                                    isFormUpdate={this.props.isFormUpdate}
                                />
                            </div>
                            <hr/>
                        </div>
                    ))
                }
            </div>
        );
    };

}


export default ProfileVenueView;