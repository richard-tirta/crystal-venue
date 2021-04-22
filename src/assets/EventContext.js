
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
    useEffect(() => {
        const cacheData = JSON.parse(localStorage.getItem('cvaEventsData'));
        const cacheTimeStamp = cacheData ? cacheData.timeStamp + 300000 : 0;
        const urlParams = new URLSearchParams(window.location.search);
        console.log('this is cache', cacheData);

        const processData = (result) => {
            //sort by event time
            const resultByEventTime = result.eventsData.slice(0);
            resultByEventTime.sort((a, b) => {
                return a.time - b.time;
            });
            console.log('hello', result);

            setData({
                userName: result.userData.userName,
                userIsMature: result.userData.isUserMature,
                filterMature: result.userData.isUserMature,
                events: resultByEventTime,
            });
        }

        if (cacheTimeStamp < Date.now()) {
            console.log('grab new data');
            fetch('/allEvents')
                .then(response => {
                    if (response.status !== 200) {
                        console.log('Looks like there was a problem. Status Code: ' +
                            response.status);
                    }
                    response.json().then(
                        (result) => {
                            console.log(result);
                            const cacheData = result;
                            cacheData.timeStamp = Date.now();

                            processData(result);
                            // save this in local storage
                            localStorage.removeItem('cvaEventsData');
                            localStorage.setItem('cvaEventsData', JSON.stringify(cacheData));
                        },
                        (error) => {
                            console.log('error');
                        }
                    )
                })
        } else {
            console.log("let's use cache");
            processData(cacheData);
        }
    }, [data.userName]);

    console.log('hello provider');
        
    return (
        <EventContext.Provider value={[data, setData]}>
            {props.children}
        </EventContext.Provider>
    );
}