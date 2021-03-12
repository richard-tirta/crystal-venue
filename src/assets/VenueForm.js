import React from "react";

class VenueForm extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <form>
                    <div className="form-column">
                        <label for="mature">Venue Name*</label>
                        <input type="text" id="venue-form_name" className="form-input" name="venue-name" minLength="3" maxLength="50" placeholder="Venue Name" required />
                        <label for="mature">Venue Description*</label>
                        <textarea id="venue-form_description" rows="3" cols="50" minLength="10" className="form_textarea" placeholder="Venue Description" required />

                        <label for="mature">Venue World*</label>
                        <select name="world" id="venue-form_world" required>
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

                        <label for="mature">Venue Location*</label>
                        <select name="location" id="venue-form_location" required>
                            <option value="">--Select Location--</option>
                            <option value="Lavender Bed">Lavender Bed</option>
                            <option value="Goblet">Goblet</option>
                            <option value="Mist">Mist</option>
                            <option value="Shirogane">Shirogane</option>
                        </select>

                        <label for="mature">Venue Ward*</label>
                        <input type="text" id="venue-form_ward" className="form-input" name="venue-ward" minLength="1" maxLength="2" placeholder="Ward" required />

                        <label for="mature">Venue Plot*</label>
                        <input type="text" id="venue-form_plot" className="form-input" name="venue-plot" minLength="1" maxLength="2" placeholder="Plot" required />
                    </div>
                    <div className="form-column">
                        <label for="mature">Venue Website</label>
                        <input type="text" id="venue-form_url" className="form_input" name="url"
                            minLength="4" maxLength="50" placeholder="Venue Website" className="form_input" />

                        <label for="mature">Venue Main Type*</label>
                        <select name="type1" id="venue-form_type1" required>
                            <option value="">--Select Venue Main Type--</option>
                            <option value="Music Performance">Music Performance</option>
                            <option value="Full Bar">Full Bar</option>
                            <option value="Food">Food</option>
                            <option value="Novelties">Novelties</option>
                            <option value="Sports">Sports</option>
                            <option value="Lgbtq">LBTQ+ Owned</option>
                        </select>

                        <label for="mature">Venue Second Type</label>
                        <select name="type1" id="venue-form_type2">
                            <option value="">--Select Venue Main Type--</option>
                            <option value="Music Performance">Music Performance</option>
                            <option value="Full Bar">Full Bar</option>
                            <option value="Food">Food</option>
                            <option value="Novelties">Novelties</option>
                            <option value="Sports">Sports</option>
                            <option value="Lgbtq">LBTQ+ Owned</option>
                        </select>

                        <label for="mature">Venue Third Type</label>
                        <select name="type1" id="venue-form_type3">
                            <option value="">--Select Venue Main Type--</option>
                            <option value="Music Performance">Music Performance</option>
                            <option value="Full Bar">Full Bar</option>
                            <option value="Food">Food</option>
                            <option value="Novelties">Novelties</option>
                            <option value="Sports">Sports</option>
                            <option value="Lgbtq">LBTQ+ Owned</option>
                        </select>

                        <div className="form-checkbox-container">
                            <label for="mature">Mature (18+)</label>
                            <input className="form-checkbox" type="checkbox" id="mature" name="mature" />
                        </div>

                        <button type="submit" id="submit-cta"
                            className="form-submit"
                            value="Venue Sent">
                            Submit
                        </button>

                    </div>
                </form>
            </div>
        );
    }
}

export default VenueForm;