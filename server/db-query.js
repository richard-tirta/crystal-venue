const doteenv = require('dotenv');
const Pool = require('pg').Pool;

doteenv.config();

const pool = process.env.DATABASE_URL
    ? new Pool({
        connectionString: process.env.DATABASE_URL + "?sslmode=require",
        ssl: {
            rejectUnauthorized: false
        }
    })
    : new Pool({
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DATABASE,
        password: process.env.POSTGRES_PASSWORD,
        port: process.env.POSTGRES_PORT,
    });


//=========== USERS ===================

const getUserByUserId = (userId) => {
    const query = 'SELECT * FROM users WHERE userid = $1';

    return new Promise(function (resolve, reject) {
        pool.query(query, [userId], (err, response) => {
            if (err) {
                console.log('getUserByUserId error', err)
                reject(0);
            } else {
                resolve(response.rows);
            }
        })
    });
}

const addNewUserToDb = (data) => {
    console.log('GOING TO ADD NEW USER TO DB', data);
    const { id, username, discriminator, avatar, isMember, haveVenue } = data

    pool.query('INSERT INTO users (userid, username, discriminator, avatar, isMember, haveVenue ) VALUES ($1, $2, $3, $4, $5, $6)', [id, username, discriminator, avatar, isMember, haveVenue], (error, results) => {
        if (error) {
            throw error
        }
        console.log('User added');
    })
}

const updateBday = (data) => {
    console.log('GOING TO UPDATE BDAY TO DB', data);
    const { userId, birthday } = data

    pool.query(
        'UPDATE users SET birthday = $1 WHERE userid = $2',
        [birthday, userId],
        (error, results) => {
            if (error) {
                throw error
            }
            console.log('Users bday is updated');
        }
    )
}

//=========== VENUES ===================

const getAllVenues = () => {
    const query = 'SELECT id, name, description, world, location, ward, plot, aetheryte, website, type1, type2, type3, ismature, image, haveevents FROM venues ORDER BY id ASC';

    return new Promise(function (resolve, reject) {
        pool.query(query, (err, response) => {
            if (err) {
                console.log('getAllVenues error', err)
                reject(0);
            } else {
                resolve(response.rows);
            }
        })
    });
}

const getVenueByUserId = (userId) => {
    const query = 'SELECT id, name, description, world, location, ward, plot, aetheryte, website, type1, type2, type3, image, haveevents  FROM venues WHERE userid = $1';

    return new Promise(function (resolve, reject) {
        pool.query(query, [userId], (err, response) => {
            if (err) {
                console.log('getVenueByUserId error', err)
                reject(0);
            } else {
                resolve(response.rows);
            }
        })
    });
}

const getVenueByVenueId = (data) => {

    const { venueId } = data

    return new Promise(function (resolve, reject) {
        pool.query('SELECT * FROM venues WHERE id = $1', [venueId], (err, response) => {
            if (err) {
                console.log('getVenueByVenueId error', err)
                reject(0);
            } else {
                resolve(response.rows);
            }
        })
    });
}

const addNewVenueToDb = (data) => {
    console.log('GOING TO ADD NEW VENUE TO DB', data);
    const { userId, venueName, venueDescription, venueWorld, venueLocation, venueWard, venuePlot, venueAetheryte, venueWebsite, venueType1, venueType2, venueType3, isMature } = data

    pool.query('INSERT INTO venues (userid, name, description, world, location, ward, plot, aetheryte, website, type1, type2, type3, ismature) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)', [userId, venueName, venueDescription, venueWorld, venueLocation, venueWard, venuePlot, venueAetheryte, venueWebsite, venueType1, venueType2, venueType3, isMature], (error, results) => {
        if (error) {
            throw error
        }
        console.log('Venue added');
    })

    pool.query(
        'UPDATE users SET haveVenue = true WHERE userid = $1',
        [data.userId],
        (error, results) => {
            if (error) {
                throw error
            }
            console.log('Users updated to have venue');
        }
    )
}

const updateVenueByVenueId = (data) => {
    console.log('GOING TO UPDATE VENUE BY VENUE ID', data);
    const { venueId, venueDescription, venueWorld, venueLocation, venueWard, venuePlot, venueAetheryte, venueWebsite, venueType1, venueType2, venueType3, isMature } = data;

    const query = 'UPDATE venues SET description = $2, world = $3, location = $4, ward = $5, plot = $6, aetheryte = $7, website = $8, type1 = $9, type2 = $10, type3 = $11, ismature = $12  WHERE id = $1';

    pool.query(query, [venueId, venueDescription, venueWorld, venueLocation, venueWard, venuePlot, venueAetheryte, venueWebsite, venueType1, venueType2, venueType3, isMature], (error, results) => {
        if (error) {
            throw error
        }
        console.log('Venue Updated');
    })
}

const deleteVenueByVenueId = (data) => {
    console.log('GOING TO DELETE EVENT BY EVENT ID AND ALL EVENTS ASSOCIATED WITH IT', data);
    const { venueId, userId, venueCount } = data

    pool.query('DELETE FROM events WHERE venueid = $1', [venueId], (error, results) => {
        if (error) {
            throw error
        }
        console.log('Events removed');
    })

    pool.query('DELETE FROM venues WHERE id = $1', [venueId], (error, results) => {
        if (error) {
            throw error
        }
        console.log('Venue removed');
    })

    if (venueCount - 1 < 1) {
        pool.query(
            'UPDATE users SET haveVenue = false WHERE userid = $1',
            [userId],
            (error, results) => {
                if (error) {
                    throw error
                }
                console.log('Users updated to have no venue');
            }
        )
    }
}


//=========== EVENTS ===================

const getAllEvents = () => {
    const query = 'SELECT id, venueid, name, subtitle, time, ismature, image, venuename, type1, type2, type3 FROM events ORDER BY id ASC';

    return new Promise(function (resolve, reject) {
        pool.query(query, (err, response) => {
            if (err) {
                console.log('getAllEvents error', err)
                reject(0);
            } else {
                resolve(response.rows);
            }
        })
    });
}


const getEventsByVenueId = (venueId) => {
    const query = 'SELECT * FROM events WHERE venueid = $1';

    return new Promise(function (resolve, reject) {
        pool.query(query, [venueId], (err, response) => {
            if (err) {
                console.log('getEventsByVenueId error', err)
                reject(0);
            } else {
                resolve(response.rows);
            }
        })
    });
}

const addNewEventToDb = (data) => {
    console.log('GOING TO ADD NEW EVENT TO DB', data);
    const { userId, venueId, venueName, eventName, eventSubTitle, eventTime, eventIsMature, eventType1, eventType2, eventType3 } = data

    pool.query('INSERT INTO events (userid, venueid, venuename, name, subtitle, time, ismature, type1, type2, type3) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)', [userId, venueId, venueName, eventName, eventSubTitle, eventTime, eventIsMature, eventType1, eventType2, eventType3 ], (error, results) => {
        if (error) {
            throw error
        }
        console.log('Event added');
    })

    pool.query(
        'UPDATE venues SET haveevents = true WHERE id = $1',
        [venueId],
        (error, results) => {
            if (error) {
                throw error
            }
            console.log('Venue updated to have events');
        }
    )
}

const deleteEventByEventId = (data) => {
    console.log('GOING TO DELETE EVENT BY EVENT ID', data);
    const { eventId, venueId, eventsCount } = data

    pool.query('DELETE FROM events WHERE id = $1', [eventId], (error, results) => {
        if (error) {
            throw error
        }
        console.log('Event removed');
    })

    if (eventsCount - 1 < 1) {
        pool.query(
            'UPDATE venues SET haveevents = false WHERE id = $1',
            [venueId],
            (error, results) => {
                if (error) {
                    throw error
                }
                console.log('Venue updated to have events');
            }
        )
    }
}

const addNewLikeToDb = (data) => {
    console.log('GOING TO ADD NEW LIKETO DB', data);
    const { userId, eventId } = data

    pool.query('INSERT INTO eventlike (userid, eventid) VALUES ($1, $2)', [userId, eventId], (error, results) => {
        if (error) {
            throw error
        }
        console.log('Like added');
    })
}

module.exports = {
    getUserByUserId,
    addNewUserToDb,
    updateBday,
    getAllVenues,
    getVenueByVenueId,
    getVenueByUserId,
    addNewVenueToDb,
    updateVenueByVenueId,
    deleteVenueByVenueId,
    getAllEvents,
    getEventsByVenueId,
    addNewEventToDb,
    deleteEventByEventId,
}



