import React from "react";

class ProfileVenueForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCloseAgeGate = this.handleCloseAgeGate.bind(this);

        this.state = {
            venueName: '',
            venueDescription: '',
            venueWorld: '',
            venueLocation: '',
            venueWard: '',
            venuePlot: '',
            venueAetheryte: '',
            venueWebsite: '',
            venueType1: '',
            venueType2: '',
            venueType3: '',
            isMature: false,
            showAgeGate: false,
            errors: {
                venueWard: '',
                venuePlot: '',
            }
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        let errors = this.state.errors;
        switch (name) {
            case 'venueWard':
                errors.venueWard = isNaN(value) || parseInt(value) > 24 || parseInt(value) < 1
                    ? 'Invalid Ward. There are currently only 24 Wards'
                    : '';
            case 'venuePlot':
                errors.venuePlot = isNaN(value) || parseInt(value) > 60 || parseInt(value) < 1
                    ? 'Invalid Plot. There are currently only 60 Plots'
                    : '';
        }

        if (name == 'venueWebsite' && value) {
            value = value.replace(/(^\w+:|^)\/\//, '');
        }

        if (name === "isMature" && value && !this.props.isUserMature) {
            this.setState({
                showAgeGate: true,
            });
            return;
        }

        this.setState({
            [name]: value,
            errors,
        });
    }

    handleCloseAgeGate(event) {
        event.preventDefault();
        this.setState({
            showAgeGate: false,
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        let errors = this.state.errors;

        if (errors.venueWard || errors.venuePlot) {
            return;
        }

        const data = JSON.stringify({
            userId: this.props.userId,
            venueName: this.state.venueName,
            venueDescription: this.state.venueDescription,
            venueWorld: this.state.venueWorld,
            venueLocation: this.state.venueLocation,
            venueWard: this.state.venueWard,
            venuePlot: this.state.venuePlot,
            venueAetheryte: this.state.venueAetheryte,
            venueWebsite: this.state.venueWebsite,
            venueType1: this.state.venueType1,
            venueType2: this.state.venueType2,
            venueType3: this.state.venueType3,
            isMature: this.state.isMature,
        });

        console.log('WE ARE READY TO SHIP', data);

        fetch('/addVenue', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: data
        })
            .then(response => response.json())
            .then(
                (result) => {
                    this.props.isFormUpdate(true);
                },
                (error) => {
                    this.setState({
                        error
                    });
                }
            )
    }

    render() {
        const ageGate = (
            <div className="lightbox age-gate">
                <a href="#" onClick={this.handleCloseAgeGate}>[Close]</a>
                <h3>
                        You need to be at least 18 years old<br />
                        to list a Mature venue.
                     </h3>
                    <p>
                       Make sure your Birth date is set<br/> at the Personal Information section above.
                    </p>
            </div>
        );
        return (
            <form>
                {this.state.showAgeGate ? ageGate : null}
                <div className="column-container">
                    <div className="form-column">
                        <label htmlFor="venueName">Venue Name*</label>
                        <input type="text" id="venue-form_name" className="form-input" name="venueName" minLength="3" maxLength="50" placeholder="Venue Name" required onChange={this.handleInputChange} />
                        <label htmlFor="venueDescription">Venue Description*</label>
                        <textarea id="venue-form_description" name="venueDescription" rows="3" cols="50" minLength="10" maxLength="280" className="form_textarea" placeholder="Venue Description" onChange={this.handleInputChange} required />

                        <label htmlFor="venueWebsite">Venue Website</label>
                        <div className="form-website">
                            <span className="form-website-http">https://</span>
                            <input type="text" id="venue-form_url" className="form_input" name="venueWebsite"
                            minLength="4" maxLength="50" placeholder="Venue Website (eg: rp-venue.carrd.co)" className="form_input" onChange={this.handleInputChange} />
                        </div>
                       
                        <label htmlFor="venueType1">Venue Main Type*</label>
                        <select name="venueType1" id="venue-form_type1" onChange={this.handleInputChange} required>
                            <option value="">--Select Venue Main Type--</option>
                            <option value="Music Performance">Music Performance</option>
                            <option value="Full Bar">Full Bar</option>
                            <option value="Food">Food</option>
                            <option value="Novelties">Novelties</option>
                            <option value="Sports">Sports</option>
                            <option value="LGBTQ+ Owned">LBTQ+ Owned</option>
                        </select>

                        <label htmlFor="venueType2">Venue Second Type</label>
                        <select name="venueType2" onChange={this.handleInputChange} id="venue-form_type2">
                            <option value="">--Select Venue Main Type--</option>
                            <option value="Music Performance">Music Performance</option>
                            <option value="Full Bar">Full Bar</option>
                            <option value="Food">Food</option>
                            <option value="Novelties">Novelties</option>
                            <option value="Sports">Sports</option>
                            <option value="LGBTQ+ Owned">LBTQ+ Owned</option>
                        </select>

                        <label htmlFor="venueType3">Venue Third Type</label>
                        <select name="venueType3" onChange={this.handleInputChange} id="venue-form_type3">
                            <option value="">--Select Venue Main Type--</option>
                            <option value="Music Performance">Music Performance</option>
                            <option value="Full Bar">Full Bar</option>
                            <option value="Food">Food</option>
                            <option value="Novelties">Novelties</option>
                            <option value="Sports">Sports</option>
                            <option value="LGBTQ+ Owned">LBTQ+ Owned</option>
                        </select>

                    </div>
                    <div className="form-column">
                        <label htmlFor="venueWorld">Venue World*</label>
                        <select name="venueWorld" id="venue-form_world" onChange={this.handleInputChange} required>
                            <option value="">--Select World--</option>
                            <option value="Balmung">Balmung</option>
                            <option value="Brynhildr">Brynhildr</option>
                            <option value="Coeurl">Coeurl</option>
                            <option value="Diabolos">Diabolos</option>
                            <option value="Goblin">Goblin</option>
                            <option value="Marlboro">Marlboro</option>
                            <option value="Mateus">Mateus</option>
                            <option value="Zalera">Zalera</option>
                        </select>

                        <label htmlFor="venueLocation">Venue Location*</label>
                        <select name="venueLocation" id="venue-form_location" onChange={this.handleInputChange} required>
                            <option value="">--Select Location--</option>
                            <option value="Lavender Bed">Lavender Bed</option>
                            <option value="Goblet">Goblet</option>
                            <option value="Mist">Mist</option>
                            <option value="Shirogane">Shirogane</option>
                        </select>

                        <label htmlFor="venueWard">Venue Ward*</label>
                        {this.state.errors.venueWard.length > 0 && <span className='form-error'>{this.state.errors.venueWard}</span>}
                        <input type="text" id="venue-form_ward" className="form-input" name="venueWard" minLength="1" maxLength="2" placeholder="Ward" required onChange={this.handleInputChange} />

                        <label htmlFor="venuePlot">Venue Plot*</label>
                        {this.state.errors.venuePlot.length > 0 && <span className='form-error'>{this.state.errors.venuePlot}</span>}
                        <input type="text" id="venue-form_plot" className="form-input" name="venuePlot" minLength="1" maxLength="2" placeholder="Plot" required onChange={this.handleInputChange} />

                        <label htmlFor="venueAetheryte">Nearby Aetheryte Shard</label>
                        <input type="text" id="venue-form_url" className="form_input" name="venueAetheryte"
                            minLength="4" maxLength="70" placeholder="Nearby Aetheryte Shard" className="form_input" onChange={this.handleInputChange} required />
                        
                        <div className="form-checkbox-container">
                            <label htmlFor="isMature">Mature (18+)</label>
                            <input className="form-checkbox" type="checkbox" id="mature" name="isMature" onChange={this.handleInputChange} />
                        </div>
                    </div>
                </div>
                <a href="#" id="submit-cta"
                    className="form-submit"
                    onClick={this.handleSubmit}>
                    Submit
                    </a>
            </form>
        );
    }
}

export default ProfileVenueForm;