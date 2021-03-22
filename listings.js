const { json } = require('express');

exports.init = function (req, res) {

	const { body, validationResult } = require('express-validator');
	const app = require('./app.js');
	const cookieParser = require("cookie-parser");
	const doteenv = require('dotenv');
	const express = require('express');
	const Pool = require('pg').Pool;
	let venuesCache = {
		data: [],
		timeStamp: 0,
    }
    
    let eventsCache = {
		data: [],
		timeStamp: 0,
	};

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

	app.use(cookieParser());
	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());

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
    
	app.get('/allVenues', (req, res) => {
		const currentTime = parseInt(Date.now());
		// only grab new data if data is older than 5 minutes
		//console.log('cache', venuesCache.timeStamp + 300000, currentTime);
		if (venuesCache.timeStamp + 300000 < currentTime) {
			console.log('allVenues getting new data');
            getAllVenues().then((venues) => {
                const data = {
                    venues: venues,
                    events: eventsCache,
                }
				venuesCache = {
                    data: {
                        venues: venues,
                        events: eventsCache,
                    },
					timeStamp: currentTime,
				};
				res.send(data);
			}).catch(err => console.log(err));
		} else {
			console.log('allVenues using cache data');
			res.send(venuesCache.data);
		}
    });
    
    app.get('/allEvents', (req, res) => {
		const currentTime = parseInt(Date.now());
		
		// only grab new data if data is older than 5 minutes
		//console.log('cache', eventsCache.timeStamp + 300000, currentTime);
		if (eventsCache.timeStamp + 300000 < currentTime) {
			//console.log('allEvents getting new data');
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
}
