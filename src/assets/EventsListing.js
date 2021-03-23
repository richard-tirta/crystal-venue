
import React from "react";
import Filter from "./form_component/Filter";
import { DateTime } from "luxon";
import sampleImage from "./images/cva-no-venue.jpg";

class EventsListing extends React.Component {
    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);

        this.state = {
            events: null,
            filterMusic: false,
            filterFullBar: false,
            filterMusic: false,
            filterNovelties: false,
            filterLgbtq: false,
            filterMature: false,
        }
    }

    componentDidMount() {
        console.log('EventsListing componentDidMount');
        fetch('/allEvents')
            .then(response => {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                }
                response.json().then(
                    (result) => {
                        console.log(result);

                        //sort by event time
                        const resultByEventTime = result.slice(0);
                        resultByEventTime.sort((a, b) => {
                            return a.time - b.time;
                        });

                        this.setState({
                            events: resultByEventTime,
                        });
                    },
                    (error) => {
                        console.log('error');
                    }
                )
            })
    }

    handleInputChange(event) {
       
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        this.setState({
            [name]: value,
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
        return (
            <div>
                <Filter onChange={this.handleInputChange} />
                <section className="events-module">
                    {
                        eventData
                            ? eventData.map((cvaEvent, index) => (
                                <div key={'event' + index}>
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
                            ))
                            : null
                    }
                </section>
            </div>
        );

    };

}


export default EventsListing;