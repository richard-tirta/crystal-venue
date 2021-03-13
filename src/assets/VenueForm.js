import React from "react";

class VenueForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.state = {
            venueName: 'no name',
            venueDescription: 'no description',
            venueWorld: 'no world',
            venueLocation: 'no location',
            venueWard: 'no ward',
            venuePlot: 'no plot',
            venueWebsite: 'no website',
            venueType1: 'no type1',
            venueType2: 'no type2',
            venueType3: 'no type3',
            isMature: false,
            isFormSubmitted: false,
            errors: {
                venueWard: '',
                venuePlot: '',
            }
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
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

        this.setState({
            [name]: value,
            errors,
        });
    }

    handleSubmit(event) {
        console.log('HELLO');
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
              this.setState({
                isFormSubmitted: true,
              });
            },
            (error) => {
              this.setState({
                isFormSubmitted: false,
                error
              });
            }
          )
      }
    
    render() {
        return (
            <div>
                <form>
                    <div className="form-column">
                        <label for="venueName">Venue Name*</label>
                        <input type="text" id="venue-form_name" className="form-input" name="venueName" minLength="3" maxLength="50" placeholder="Venue Name" required onChange={this.handleInputChange}  />
                        <label for="venueDescription">Venue Description*</label>
                        <textarea id="venue-form_description" name="venueDescription" rows="3" cols="50" minLength="10" className="form_textarea" placeholder="Venue Description" onChange={this.handleInputChange} required />

                        <label for="venueWorld">Venue World*</label>
                        <select name="venueWorld" id="venue-form_world" onChange={this.handleInputChange} required>
                            <option value="">--Select World--</option>
                            <option value="Balmung">Balmung</option>
                            <option value="Brynhild">Brynhild</option>
                            <option value="Coeurl">Coeurl</option>
                            <option value="Diabolos">Diabolos</option>
                            <option value="Goblin">Goblin</option>
                            <option value="Marlboro">Marlboro</option>
                            <option value="Mateus">Mateus</option>
                            <option value="Zalera">Zalera</option>
                        </select>

                        <label for="venueLocation">Venue Location*</label>
                        <select name="venueLocation" id="venue-form_location" onChange={this.handleInputChange}  required>
                            <option value="">--Select Location--</option>
                            <option value="Lavender Bed">Lavender Bed</option>
                            <option value="Goblet">Goblet</option>
                            <option value="Mist">Mist</option>
                            <option value="Shirogane">Shirogane</option>
                        </select>

                        <label for="venueWard">Venue Ward*</label>
                        {this.state.errors.venueWard.length > 0 && <span className='form-error'>{this.state.errors.venueWard}</span>}
                        <input type="text" id="venue-form_ward" className="form-input" name="venueWard" minLength="1" maxLength="2" placeholder="Ward" required onChange={this.handleInputChange} />
                        
                        <label for="venuePlot">Venue Plot*</label>
                        {this.state.errors.venuePlot.length > 0 && <span className='form-error'>{this.state.errors.venuePlot}</span>}
                        <input type="text" id="venue-form_plot" className="form-input" name="venuePlot" minLength="1" maxLength="2" placeholder="Plot" required onChange={this.handleInputChange} />
                    </div>
                    <div className="form-column">
                        <label for="venueWebsite">Venue Website</label>
                        <input type="text" id="venue-form_url" className="form_input" name="venueWebsite"
                            minLength="4" maxLength="50" placeholder="Venue Website" className="form_input"  onChange={this.handleInputChange} />

                        <label for="venueType1">Venue Main Type*</label>
                        <select name="venueType1" id="venue-form_type1" onChange={this.handleInputChange}  required>
                            <option value="">--Select Venue Main Type--</option>
                            <option value="Music Performance">Music Performance</option>
                            <option value="Full Bar">Full Bar</option>
                            <option value="Food">Food</option>
                            <option value="Novelties">Novelties</option>
                            <option value="Sports">Sports</option>
                            <option value="Lgbtq">LBTQ+ Owned</option>
                        </select>

                        <label for="venueType2">Venue Second Type</label>
                        <select name="venueType2" onChange={this.handleInputChange}  id="venue-form_type2">
                            <option value="">--Select Venue Main Type--</option>
                            <option value="Music Performance">Music Performance</option>
                            <option value="Full Bar">Full Bar</option>
                            <option value="Food">Food</option>
                            <option value="Novelties">Novelties</option>
                            <option value="Sports">Sports</option>
                            <option value="Lgbtq">LBTQ+ Owned</option>
                        </select>

                        <label for="venueType3">Venue Third Type</label>
                        <select name="venueType3" onChange={this.handleInputChange} id="venue-form_type3">
                            <option value="">--Select Venue Main Type--</option>
                            <option value="Music Performance">Music Performance</option>
                            <option value="Full Bar">Full Bar</option>
                            <option value="Food">Food</option>
                            <option value="Novelties">Novelties</option>
                            <option value="Sports">Sports</option>
                            <option value="Lgbtq">LBTQ+ Owned</option>
                        </select>

                        <div className="form-checkbox-container">
                            <label for="isMature">Mature (18+)</label>
                            <input className="form-checkbox" type="checkbox" id="mature" name="isMature" onChange={this.handleInputChange}  />
                        </div>

                        <a href="#" id="submit-cta"
                            className="form-submit"
                            onClick={this.handleSubmit}>
                            Submit
                        </a>

                    </div>
                </form>
            </div>
        );
    }
}

export default VenueForm;