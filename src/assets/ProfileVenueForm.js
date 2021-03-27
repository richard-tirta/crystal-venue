import React from "react";
import VenueForm from "./form_component/VenueForm"

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
            value = value.replace(/^\/\/|^.*?:(\/\/)?/, '');
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
                <a href="#" onClick={this.handleCloseAgeGate} className="icon-x-wt lightbox-close">
                    Close
                </a>
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
            <form onSubmit={this.handleSubmit}>
                {this.state.showAgeGate ? ageGate : null}
                <p className="text-right"><span className="blue-baby">*</span> required</p>
                <VenueForm onChange={this.handleInputChange} errors={this.state.errors} askName={true} venueLocation={this.state.venueLocation} />
                <button href="#" id="submit-cta"
                    className="form-submit">
                    Submit
                </button>
            </form>
        );
    }
}

export default ProfileVenueForm;