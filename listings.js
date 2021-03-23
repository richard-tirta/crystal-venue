const { json } = require('express');

exports.init = function (req, res) {

	const { body, validationResult } = require('express-validator');
	const app = require('./app.js');
	const auth = require('./auth');
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

	const getAge = (date) => {
		const today = new Date();
		const birthDate = new Date(parseInt(date));
		let age = today.getFullYear() - birthDate.getFullYear();
		const month = today.getMonth() - birthDate.getMonth();
		if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		return age;
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
    
	app.get('/allVenues', (req, res) => {
		const cookieAuth = auth.init(req);
		const userId =  cookieAuth ? cookieAuth['userId'] : null;
		const currentTime = parseInt(Date.now());
		// only grab new data if data is older than 5 minutes
		//console.log('cache', venuesCache.timeStamp + 300000, currentTime);

		let sessionData = {
			data: null,
			userData: {
				userName: null,
				isUserMature: false,
			}
		}

		function sendData() {
			if (venuesCache.timeStamp + 300000 < currentTime || !venuesCache.data.events) {
				console.log('allVenues getting new data');
				getAllVenues().then((venues) => {

					//console.log('hmm', venues, eventsCache.data);
					const data = {
						venues: venues,
						events: eventsCache.data,
					}
					venuesCache = {
						data: data,
						timeStamp: currentTime,
					};
					sessionData.data = data;
					res.send(sessionData);
				}).catch(err => console.log(err));
			} else {
				//console.log('allVenues using cache data', venuesCache);
				sessionData.data = venuesCache.data;
				res.send(sessionData);
			}
		}

		if (userId) {
			getUserByUserId(userId).then((userInfo) => {
				sessionData.userData.userName = userInfo[0].username;
				sessionData.userData.isUserMature = getAge(userInfo[0].birthday) > 18 ? true : false;
				sendData();
			}).catch(err => console.log(err));
		} else {
			sendData();
		}

		
    });
    
	app.get('/allEvents', (req, res) => {
		const cookieAuth = auth.init(req);
		const userId =  cookieAuth ? cookieAuth['userId'] : null;
		const currentTime = parseInt(Date.now());

		let sessionData = {
			eventsData: null,
			userData: {
				userName: null,
				isUserMature: false,
			}
		}

		function sendData() {
			// only grab new data if data is older than 5 minutes
			//console.log('cache', eventsCache.timeStamp + 300000, currentTime);
			if (eventsCache.timeStamp + 300000 < currentTime) {
				//console.log('allEvents getting new data');
				getAllEvents().then((events) => {
					eventsCache = {
						data: events,
						timeStamp: currentTime,
					};
					sessionData.eventsData = events;
					res.send(sessionData);
				}).catch(err => console.log(err));
			} else {
				console.log('allEvents using cache data');
				sessionData.eventsData = eventsCache.data;
				res.send(sessionData);
			}
		}

		if (userId) {
			getUserByUserId(userId).then((userInfo) => {
				sessionData.userData.userName = userInfo[0].username;
				sessionData.userData.isUserMature = getAge(userInfo[0].birthday) > 18 ? true : false;
				sendData();
			}).catch(err => console.log(err));
		} else {
			sendData();
		}
	});
}
