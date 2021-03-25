
const filterCheck = (state, venue) => {

    const stateFilter = {
        bar: state.filterFullBar,
        music: state.filterMusic,
        food: state.filterFood,
        novelties: state.filterNovelties,
        sports: state.filterSports,
        lgbtq: state.filterLgbtq,
    }

    const venueType = {
        bar: venue.type1 === "Full Bar" || venue.type2 === "Full Bar" || venue.type3 === "Full Bar" ? true : false,
        music: venue.type1 === "Music Performance" || venue.type2 === "Music Performance" || venue.type3 === "Music Performance" ? true : false,
        food: venue.type1 === "Food" || venue.type2 === "Food" || venue.type3 === "Food" ? true : false,
        novelties: venue.type1 === "Novelties" || venue.type2 === "Novelties" || venue.type3 === "Novelties" ? true : false,
        sports: venue.type1 === "Sports" || venue.type2 === "Sports" || venue.type3 === "Sports" ? true : false,
        lgbtq: venue.type1 === "LGBTQ+ Owned" || venue.type2 === "LGBTQ+ Owned" || venue.type3 === "LGBTQ+ Owned" ? true : false,
    }

    const checkPrimaryFilter = () => {
        if (Object.values(stateFilter).every((v) => v === false)) {        
            isVisible = true;
        } else {
            isVisible = false;
            Object.keys(stateFilter).forEach(function (key) {              
                if (stateFilter[key]) {
                    isVisible = stateFilter[key] === venueType[key] ? true : null;
                    //console.log('MATCH', venue.name, key, stateFilter[key], venueType[key], i);
                };
            });
        }
    }

    let isVisible = false;

    if (!venue.ismature) {
        isVisible = true;
        checkPrimaryFilter();
    }

    if (state.filterMature && venue.ismature) {
        isVisible = true;
        checkPrimaryFilter();
    }

    return isVisible;
}


export default filterCheck;