
exports.init = function (req, res) {

	const { body, validationResult } = require('express-validator');
	const app = require('./app.js');
	const auth = require('./auth');
	const cookieParser = require("cookie-parser");
	const dbQuery = require('./db-query');
	const doteenv = require('dotenv');
	const express = require('express');

	let venuesCache = {
		data: [],
		timeStamp: 0,
    }
    
    let eventsCache = {
		data: [],
		timeStamp: 0,
	};

	doteenv.config();

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
    
	app.get('/allVenues', (req, res) => {
		const cookieAuth = auth.init(req);
		const userIdAuth =  cookieAuth ? cookieAuth['userId'] : null;
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
				dbQuery.getAllVenues().then((venues) => {

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

		if (userIdAuth) {
			dbQuery.getUserByUserId(userIdAuth).then((userInfo) => {
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
		const userIdAuth  =  cookieAuth ? cookieAuth['userId'] : null;
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
				dbQuery.getAllEvents().then((events) => {
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

		if (userIdAuth ) {
			dbQuery.getUserByUserId(userIdAuth ).then((userInfo) => {
				sessionData.userData.userName = userInfo[0].username;
				sessionData.userData.isUserMature = getAge(userInfo[0].birthday) > 18 ? true : false;
				sendData();
			}).catch(err => console.log(err));
		} else {
			sendData();
		}
	});
}
