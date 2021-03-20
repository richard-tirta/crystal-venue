const { json } = require('express');

exports.init = function (req, res) {

	const { body, validationResult } = require('express-validator');
	const app = require('./app.js');
	const cookieParser = require("cookie-parser");
	const cors = require('cors');
	const express = require('express');
	const Pool = require('pg').Pool;

	const pool = new Pool({
		user: 'me',
		host: 'localhost',
		database: 'cva',
		password: 'password',
		port: 5432,
	})

	app.use(cookieParser());
	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());
	app.use(cors());

	const addNewEventToDb = (data) => {
		console.log('GOING TO ADD NEW EVENT TO DB', data);
		const { userId, venueId, eventName, eventSubTitle, eventTime, eventIsMature } = data

		pool.query('INSERT INTO events (userid, venueid, name, subtitle, time, ismature) VALUES ($1, $2, $3, $4, $5, $6)', [userId, venueId, eventName, eventSubTitle, eventTime, eventIsMature ], (error, results) => {
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

	app.post('/addEvent', [
		body('userId')
			.escape()
			.not()
			.isString(),
		body('venueId')
			.escape()
			.not()
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
	], function (req, res) {
		console.log('addEvent POST received', req.body);

		const eventObject = {
			userId: req.body.userId,
			venueId: req.body.venueId,
			eventName: req.body.eventName,
			eventSubTitle: req.body.eventSubTitle,
			eventTime: req.body.eventTime,
			eventIsMature: req.body.eventIsMature,
		}
		addNewEventToDb(eventObject);
		res.status(200).send({ success: true })

	});

}
