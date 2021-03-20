const { json } = require('express');

exports.init = function (req, res) {

	const { body, validationResult } = require('express-validator');
	const app = require('./app.js');
	const cookieParser = require("cookie-parser");
	const express = require('express');
	const Pool = require('pg').Pool;

	if (process.env.DATABASE_URL) {
		pool = new Pool({
			connectionString: process.env.DATABASE_URL,
			ssl: {
				rejectUnauthorized: false
			}
		})
	} else {
		pool = new Pool({
			user: process.env.DB_USER,
			host: process.env.DB_HOST,
			database: process.env.DB_DATABASE,
			password: process.env.DB_PASSWORD,
			port: process.env.DB_PORT,
		})
	}

	app.use(cookieParser());
	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());

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

	app.post('/addVenue', [
		body('userId')
			.escape()
			.not()
			.isString(),
		body('venueName')
			.escape()
			.isString(),
		body('venueDescription')
			.escape()
			.isString(),
		body('venueWorld')
			.escape()
			.isString(),
		body('venueLocation')
			.escape()
			.isString(),
		body('venueWard')
			.escape()
			.not()
			.isString(),
		body('venuePlot')
			.escape()
			.not()
			.isString(),
		body('venueAetheryte')
			.escape()
			.isString(),
		body('venueWebsite')
			.escape()
			.isString(),
		body('venueType1')
			.escape()
			.isString(),
		body('venueType2')
			.escape()
			.isString(),
		body('venueType3')
			.escape()
			.isString(),
		body('isMature')
			.escape()
			.isBoolean()
	], function (req, res) {
		console.log('addVenue POST received', req.body);

		const venueObject = {
			userId: req.body.userId,
			venueName: req.body.venueName,
			venueDescription: req.body.venueDescription,
			venueWorld: req.body.venueWorld,
			venueLocation: req.body.venueLocation,
			venueWard: req.body.venueWard,
			venuePlot: req.body.venuePlot,
			venueAetheryte: req.body.venueAetheryte,
			venueWebsite: req.body.venueWebsite,
			venueType1: req.body.venueType1,
			venueType2: req.body.venueType2,
			venueType3: req.body.venueType3,
			isMature: req.body.isMature,
		}
		addNewVenueToDb(venueObject);
		res.status(200).send({ success: true })

	});

}
