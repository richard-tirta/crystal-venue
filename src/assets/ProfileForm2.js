
import React from "react";
import VenueLocation from './form_component/VenueLocation'
import ErrorBoundary from './ErrorBoundary'

class ProfileForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };

    }

    render() {
        return (<div>
            <form id="profile-form" name="profile-form">
            <input type="text" id="profile-form_bdate" className="profile-form_input" name="bdate" required
                    minLength="1" maxLength="2" placeholder="Date" />
                  <input type="text" id="profile-form_bmonth" className="profile-form_input" name="bmonth" required
                    minLength="1" maxLength="2" placeholder="Month" />
                  <input type="text" id="profile-form_byear" className="profile-form_input" name="byear" required
                    minLength="4" maxLength="4" placeholder="Year" />
            </form>
            <form id="venue-form" name="venue-form">
                <input type="text" id="venue-form_name" className="venue-form_input" name="name" required
                    minLength="4" maxLength="50" placeholder="Venue Name" />
                <textarea id="venue-form_description" rows="3" cols="80" minLength="10" className="venue-form_textarea" requried >Venue Description</textarea>
                <input type="text" id="venue-form_url" className="venue-form_input" name="url"
                    minLength="4" maxLength="50" placeholder="Venue Website" className="venue-form_input"  />
                <select name="type1" id="venue-form_type1" required>
                    <option value="">--Select Venue Main Type--</option>
                    <option value="Music Performance">Music Performance</option>
                    <option value="Full Bar">Full Bar</option>
                    <option value="Food">Food</option>
                    <option value="Novelties">Novelties</option>
                    <option value="Sports">Sports</option>
                    <option value="Lgbtq">LBTQ+ Owned</option>
                </select>
                <select name="type1" id="venue-form_type2">
                    <option value="">--Select Venue Main Type--</option>
                    <option value="Music Performance">Music Performance</option>
                    <option value="Full Bar">Full Bar</option>
                    <option value="Food">Food</option>
                    <option value="Novelties">Novelties</option>
                    <option value="Sports">Sports</option>
                    <option value="Lgbtq">LBTQ+ Owned</option>
                </select>
                <select name="type1" id="venue-form_type3">
                    <option value="">--Select Venue Main Type--</option>
                    <option value="Music Performance">Music Performance</option>
                    <option value="Full Bar">Full Bar</option>
                    <option value="Food">Food</option>
                    <option value="Novelties">Novelties</option>
                    <option value="Sports">Sports</option>
                    <option value="Lgbtq">LBTQ+ Owned</option>
                </select>
                <input type="checkbox" id="mature" name="mature"></input>
                <label for="mature">Mature (18+)</label>
            </form>
            <VenueLocation/>
        </div>);
    };

}


export default ProfileForm;