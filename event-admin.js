const { json } = require('express');

exports.init = function (req, res) {

	const { body, validationResult } = require('express-validator');
	const app = require('./app.js');
	const doteenv = require('dotenv');
	const express = require('express');
	const Pool = require('pg').Pool;
	let eventsCache = {
		data: [],
		timeStamp: 0,
	};

	let veneusCache = {
		data: [],
		timeStamp: 0,
	}

	doteenv.config();

	const pool = process.env.DATABASE_URL
		? new Pool({
			connectionString: process.env.DATABASE_URL,
			ssl: {
				rejectUnauthorized: false
			}
		})
		: new Pool({
			user: process.env.DB_USER,
			host: process.env.DB_HOST,
			database: process.env.DB_DATABASE,
			password: process.env.DB_PASSWORD,
			port: process.env.DB_PORT,
		});

	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());
	
	const getAllEvents = () => {
		const query = 'SELECT * FROM events ORDER BY id ASC';

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

	const getAllVenues = () => {
		const query = 'SELECT * FROM venues ORDER BY id ASC';

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

	const addNewEventToDb = (data) => {
		console.log('GOING TO ADD NEW EVENT TO DB', data);
		const { userId, venueId, venueName, eventName, eventSubTitle, eventTime, eventIsMature } = data

		pool.query('INSERT INTO events (userid, venueid, venuename, name, subtitle, time, ismature) VALUES ($1, $2, $3, $4, $5, $6, $7)', [userId, venueId, venueName, eventName, eventSubTitle, eventTime, eventIsMature ], (error, results) => {
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
	
	app.get('/allEvents', (req, res) => {
		const currentTime = parseInt(Date.now());
		// only grab new data if data is older than 5 minutes
		console.log('cache', eventsCache.timeStamp + 300000, currentTime);
		if (eventsCache.timeStamp + 300000 < currentTime) {
			console.log('allEvents getting new data');
			getAllEvents().then((events) => {
				eventsCache = {
					data: events,
					timeStamp: currentTime,
				};
				res.send(events);
			}).catch(err => console.log(err));
		} else {
			console.log('allEvents using cache data');
			res.send(eventsCache.data);
		}
	});

	app.get('/allVenues', (req, res) => {
		const currentTime = parseInt(Date.now());
		// only grab new data if data is older than 5 minutes
		console.log('cache', venuesCache.timeStamp + 300000, currentTime);
		if (venuesCache.timeStamp + 300000 < currentTime) {
			console.log('allVenues getting new data');
			getAllVenues().then((venues) => {
				venuesCache = {
					data: venues,
					timeStamp: currentTime,
				};
				res.send(venues);
			}).catch(err => console.log(err));
		} else {
			console.log('allVenues using cache data');
			res.send(venuesCache.data);
		}
	});

	app.post('/addEvent', [
		body('userId')
			.escape()
			.not()
			.isString(),
		body('venueId')
			.escape()
			.not()
			.isString(),
		body('venueName')
			.escape()
			.isString(),
		body('eventName')
			.escape()
			.isString(),
		body('venueSubTitle')
			.escape()
			.isString(),
		body('eventTime')
			.escape()
			.not()
			.isString(),
		body('eventIsMature')
			.escape()
			.isBoolean()
	], (req, res) => {
		console.log('addEvent POST received', req.body);

		const eventObject = {
			userId: req.body.userId,
			venueId: req.body.venueId,
			venueName: req.body.venueName,
			eventName: req.body.eventName,
			eventSubTitle: req.body.eventSubTitle,
			eventTime: req.body.eventTime,
			eventIsMature: req.body.eventIsMature,
		}
		addNewEventToDb(eventObject);
		res.status(200).send({ success: true })

	});

	app.delete('/deleteEvent', [
		body('eventId')
			.escape()
			.not()
			.isString(),
		body('venueId')
			.escape()
			.not()
			.isString(),
		body('eventsCount')
			.escape()
			.not()
			.isString()
	], (req, res) => {
		console.log('deleteEvent DELETE received', req.body);

		const eventObject = {
			eventId: req.body.eventId,
			venueId: req.body.venueId,
			eventsCount: req.body.eventsCount,
		}
		deleteEventByEventId(eventObject);
		res.status(200).send({ success: true })
	});

}
