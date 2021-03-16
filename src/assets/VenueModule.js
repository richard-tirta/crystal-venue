
import fetch from "node-fetch";
import React from "react";
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

        fetch('/upload', {
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
                            <p class="venue-desc_type">{venue.venueType1} | {venue.venueType2} | {venue.venueType3}
                            </p>
                        </div>
                        <div className="venue-desc_location">
                            <h4>{venue.venueWorld} | {venue.venueLocation} | Ward {venue.venueWard} | Plot {venue.venuePlot}</h4>
                            <p class="venue-desc_aetheryte">
                                <span className="icon-aetheryte">Nearby Aetheryte Shard:</span>
                                {venue.venueAetheryte}
                            </p>
                        </div>
                    </div>
                    <div className="venue-image">
                        {this.state.showImageUpload ? imageUploadEl : null }
                        <img src={venueImage}/>
                        <a href="#" className="edit-venue-button" onClick={this.handleImageEditBtn}>Edit Venue Pic &raquo;</a>
                    </div>
                </div>
                
            </div>
        );
    };

}


export default VenueModule;