
import React, {useState, useEffect, createContext} from "react";

export const EventContext = createContext();

export const EventProvider = props => {
    const [data, setData] = useState([
        {
            userName: undefined,
            userIsMature: undefined,
            filterMature: undefined,
            events: null,
        }
    ]);

    console.log('hello provider');
        
    return (
        <EventContext.Provider value={[data, setData]}>
            {props.children}
        </EventContext.Provider>
    );
}