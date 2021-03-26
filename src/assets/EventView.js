
import React from "react";
import ReactDOM from "react-dom";
import MainNav from "./MainNav";
import Filter from "./form_component/Filter";
import HelperFilter from "./HelperFilter";
import { DateTime } from "luxon";
import sampleImage from "./images/cva-no-event.jpg";

export const UserContext = React.createContext(undefined);

class EventView extends React.Component {
    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleCloseAgeGate = this.handleCloseAgeGate.bind(this);

        this.state = {
            userName: undefined,
            userIsMature: undefined,
            events: null,
            filterMusic: false,
            filterFullBar: false,
            filterFood: false,
            filterNovelties: false,
            filterSports: false,
            filterLgbtq: false,
            filterMature: false,
            showAgeGate: false,
        }
    }

    componentDidMount() {
        const result = this.props.data;
        //sort by event time
        const resultByEventTime = result.eventsData.slice(0);
        resultByEventTime.sort((a, b) => {
            return a.time - b.time;
        });

        this.setState({
            userName: result.userData.userName,
            userIsMature: result.userData.isUserMature,
            filterMature: result.userData.isUserMature,
            events: resultByEventTime,
        });

        this.context = result.userData.userName;

        console.log('eventview this context', this.context);
    }

    handleInputChange(event) {

        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        if (name === "filterMature" && value && !this.state.userIsMature) {
            this.setState({
                showAgeGate: true,
            });
            return;
        }

        this.setState({
            [name]: value,
        });
    }

    handleCloseAgeGate(event) {
        event.preventDefault();
        this.setState({
            showAgeGate: false,
        });
    }

    render() {
        const eventData = this.state.events;
        const eventImage = (eventImage) => {
            return eventImage ? eventImage : sampleImage;
        };

        const getTime = (data) => {
            const newDate = DateTime.fromMillis(parseInt(data)).toFormat('EEE, MMM. dd | hh:mm a ZZZZ');
            return newDate;
        }

        const ageGate = (
            <div className="lightbox age-gate">
                <a href="#" onClick={this.handleCloseAgeGate} className="icon-x-wt lightbox-close">
                    Close
                </a>
                <h3>
                    You need to be at least 18 years old<br />
                        to activate this filter.
                     </h3>
                <p>
                    Go to <a href="/profile">Profile Page &raquo;</a><br />
                        to make sure your birth date is set.
                    </p>
            </div>
        );

        const eventModule = (cvaEvent) => {
            return (
                <div key={'event' + cvaEvent.id}>
                    <div className="event-item">
                        <div className="event-image">
                            <img src={eventImage(cvaEvent.image)} />
                        </div>
                        <div className="event-description">
                            <p>
                                {getTime(cvaEvent.time)}
                            </p>
                            <h3>{cvaEvent.name}</h3>
                            <h4>{cvaEvent.subtitle}</h4>
                            <p className="event-venue">{cvaEvent.venuename}</p>
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div>
                <Filter onChange={this.handleInputChange} filterMature={this.state.filterMature} />
                {this.state.showAgeGate ? ageGate : null}
                <section className="events-module">
                    {
                        eventData
                            ? eventData.map((cvaEvent, index) => (
                                HelperFilter(this.state, cvaEvent) ? eventModule(cvaEvent) : null
                            ))
                            : null
                    }
                </section>
            </div>
        );

    };

}

EventView.contextType = UserContext;


export default EventView;