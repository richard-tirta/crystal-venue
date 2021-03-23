
import React from "react";

const EventTime = ((props) => (
    <div>
        <div className="listing-filters">
            <div className="main-filters">
                <div className="form-checkbox-container">
                    <label htmlFor="music">Live Music</label>
                    <input className="form-checkbox" type="checkbox" id="filter-music" name="filterMusic" onChange={props.onChange} />
                </div>
                <div className="form-checkbox-container">
                    <label htmlFor="full-bar">Full Bar</label>
                    <input className="form-checkbox" type="checkbox" id="filter-bar" name="filterFullBar" onChange={props.onChange} />
                </div>
                <div className="form-checkbox-container">
                    <label htmlFor="food">Live Music</label>
                    <input className="form-checkbox" type="checkbox" id="filter-food" name="filterFood" onChange={props.onChange} />
                </div>
                <div className="form-checkbox-container">
                    <label htmlFor="novelties">Novelties</label>
                    <input className="form-checkbox" type="checkbox" id="filter-novelties" name="filterNovelties" onChange={props.onChange} />
                </div>
                <div className="form-checkbox-container">
                    <label htmlFor="lgbtq-owned">LGBTQ+ Owned</label>
                    <input className="form-checkbox" type="checkbox" id="filter-lgbtq" name="filterLgbtq" onChange={props.onChange} />
                </div>
            </div>
            <div className="secondary-filters">
                <div className="form-checkbox-container">
                    <label htmlFor="mature">Mature (18+)</label>
                    <input className="form-checkbox" type="checkbox" id="filter-mature" name="filterMature" onChange={props.onChange} />
                </div>
            </div>
        </div>
    </div>
));


export default EventTime;