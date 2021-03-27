
import React from "react";
import Aetheryte from "./Aetheryte";
import Aetheryt from "./Aetheryte";

const VenueForm = ((props) => (
    <div className="column-container">
        <div className="form-column">

            {
                props.askName
                    ? (
                        <React.Fragment>
                            <label htmlFor="venueName">Venue Name<span className="blue-baby">*</span></label>
                            <input type="text" id="venue-form_name" className="form-input" name="venueName" minLength="3" maxLength="50" placeholder="Venue Name" required onChange={props.onChange} />
                        </React.Fragment>
                    )
                    : null
            }
            
            <label htmlFor="venueDescription">Venue Description<span className="blue-baby">*</span></label>
            <textarea id="venue-form_description" name="venueDescription" rows="3" cols="50" minLength="10" maxLength="280" className="form_textarea" placeholder="Venue Description" onChange={props.onChange} required />

            <label htmlFor="venueWebsite">Venue Website</label>
            <div className="form-website">
                <span className="form-website-http">https://</span>
                <input type="text" id="venue-form_url" className="form_input" name="venueWebsite"
                    minLength="4" maxLength="50" placeholder="Venue Website (eg: rp-venue.carrd.co)" className="form_input" onChange={props.onChange} />
            </div>

            <label htmlFor="venueType1">Venue Main Type<span className="blue-baby">*</span></label>
            <select name="venueType1" id="venue-form_type1" onChange={props.onChange} required>
                <option value="">--Select Venue Main Type--</option>
                <option value="Music Performance">Music Performance</option>
                <option value="Full Bar">Full Bar</option>
                <option value="Food">Food</option>
                <option value="Novelties">Novelties</option>
                <option value="Sports">Sports</option>
                <option value="LGBTQ+ Owned">LBTQ+ Owned</option>
            </select>

            <label htmlFor="venueType2">Venue Second Type</label>
            <select name="venueType2" onChange={props.onChange} id="venue-form_type2">
                <option value="">--Select Venue Main Type--</option>
                <option value="Music Performance">Music Performance</option>
                <option value="Full Bar">Full Bar</option>
                <option value="Food">Food</option>
                <option value="Novelties">Novelties</option>
                <option value="Sports">Sports</option>
                <option value="LGBTQ+ Owned">LBTQ+ Owned</option>
            </select>

            <label htmlFor="venueType3">Venue Third Type</label>
            <select name="venueType3" onChange={props.onChange} id="venue-form_type3">
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
            <label htmlFor="venueWorld">Venue World<span className="blue-baby">*</span></label>
            <select name="venueWorld" id="venue-form_world" onChange={props.onChange} required>
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

            <label htmlFor="venueLocation">Venue Location<span className="blue-baby">*</span></label>
            <select name="venueLocation" id="venue-form_location" onChange={props.onChange} required>
                <option value="">--Select Location--</option>
                <option value="Lavender Beds">Lavender Beds</option>
                <option value="Goblet">Goblet</option>
                <option value="Mist">Mist</option>
                <option value="Shirogane">Shirogane</option>
            </select>

            <label htmlFor="venueWard">Venue Ward<span className="blue-baby">*</span></label>
            {props.errors.venueWard.length > 0 && <span className='form-error'>{props.errors.venueWard}</span>}
            <input type="text" id="venue-form_ward" className="form-input" name="venueWard" minLength="1" maxLength="2" placeholder="Ward" required onChange={props.onChange} />

            <label htmlFor="venuePlot">Venue Plot<span className="blue-baby">*</span></label>
            {props.errors.venuePlot.length > 0 && <span className='form-error'>{props.errors.venuePlot}</span>}
            <input type="text" id="venue-form_plot" className="form-input" name="venuePlot" minLength="1" maxLength="2" placeholder="Plot" required onChange={props.onChange} />

            <label htmlFor="venueAetheryte">Nearby Aetheryte Shard<span className="blue-baby">*</span></label>
            <Aetheryte onChange={props.onChange} errors={props.errors} venueLocation={props.venueLocation}/>

            <div className="form-checkbox-container">
                <label htmlFor="isMature">Mature (18+)</label>
                <input className="form-checkbox" type="checkbox" id="mature" name="isMature" onChange={props.onChange} />
            </div>
        </div>
    </div>
));


export default VenueForm;