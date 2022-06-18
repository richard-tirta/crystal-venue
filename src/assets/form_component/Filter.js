
import React from "react";

const Filter = ((props) => (
    <div>
        <div className="listing-filters">
            <div className="main-filters">
                <div className="form-checkbox-container">
                    <input className="form-checkbox" type="checkbox" id="filter-music" name="filterMusic" onChange={props.onChange} />
                    <label htmlFor="music">Live Music</label>
                </div>
                <div className="form-checkbox-container">
                    <input className="form-checkbox" type="checkbox" id="filter-bar" name="filterFullBar" onChange={props.onChange} />
                    <label htmlFor="full-bar">Full Bar</label>
                </div>
                <div className="form-checkbox-container">
                    <input className="form-checkbox" type="checkbox" id="filter-food" name="filterFood" onChange={props.onChange} />
                    <label htmlFor="food">Food</label>
                </div>
                <div className="form-checkbox-container">
                    <input className="form-checkbox" type="checkbox" id="filter-novelties" name="filterNovelties" onChange={props.onChange} />
                    <label htmlFor="novelties">Novelties</label>
                </div>
                <div className="form-checkbox-container">
                    <input className="form-checkbox" type="checkbox" id="filter-lgbtq" name="filterLgbtq" onChange={props.onChange} />
                    <label htmlFor="lgbtq-owned">LGBTQ+ Owned</label>
                </div>
            </div>
            <div className="secondary-filters">
            <div className="form-checkbox-container">
                    <label htmlFor="show-previous">Previous Events</label>
                    <input className="form-checkbox" type="checkbox" id="show-previous" name="showPrevious" onChange={props.onChange} />
                </div>

                <div className="form-checkbox-container">
                    <label htmlFor="mature">Mature (18+)</label>
                    <input className="form-checkbox" type="checkbox" id="filter-mature" name="filterMature" checked={props.filterMature} onChange={props.onChange} />
                </div>
            </div>
        </div>
    </div>
));


export default Filter;