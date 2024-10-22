
exports.init = function (req, res) {

	const { body, validationResult } = require('express-validator');
	const app = require('../app.js');
	const auth = require('./auth');
	const cookieParser = require("cookie-parser");
	const dbQuery = require('./db-query');
	const express = require('express');
	
	app.use(cookieParser());
	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());

	app.post('/addVenue', [
		body('userId')
			.escape()
			.notEmpty()
			.not()
			.isString(),
		body('venueName')
			.escape()
			.notEmpty()
			.isString(),
		body('venueDescription')
			.escape()
			.notEmpty()
			.isString(),
		body('venueWorld')
			.escape()
			.notEmpty()
			.isString(),
		body('venueLocation')
			.escape()
			.notEmpty()
			.isString(),
		body('venueWard')
			.escape()
			.notEmpty()
			.not()
			.isString(),
		body('venuePlot')
			.escape()
			.notEmpty()
			.not()
			.isString(),
		body('venueAetheryte')
			.escape()
			.notEmpty()
			.isString(),
		body('venueWebsite')
			.escape()
			.isString(),
		body('venueType1')
			.escape()
			.notEmpty()
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

		const cookieAuth = auth.init(req);
		const userIdAuth =  cookieAuth ? cookieAuth['userId'] : null;

		if (userIdAuth !== req.body.userId) {
			res.redirect('/profile');
			return;
		}

		// make sure following is not empty
		if (
			!req.body.userId
			&& !req.body.venueName
			&& !req.body.venueWorld
			&& !req.body.venueLocation
			&& !req.body.venueWard
			&& !req.body.venuePlot
			&& !req.body.venueType1
		) {
			res.status(400).send({ success: false });
			return;
		}

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
		dbQuery.addNewVenueToDb(venueObject);
		res.status(200).send({ success: true });

	});

	app.post('/updateVenue', [
		body('userId')
			.escape()
			.notEmpty()
			.not()
			.isString(),
		body('venueId')
			.escape()
			.notEmpty()
			.not()
			.isString(),
		body('venueDescription')
			.escape()
			.notEmpty()
			.isString(),
		body('venueWorld')
			.escape()
			.notEmpty()
			.isString(),
		body('venueLocation')
			.escape()
			.notEmpty()
			.isString(),
		body('venueWard')
			.escape()
			.notEmpty()
			.not()
			.isString(),
		body('venuePlot')
			.escape()
			.notEmpty()
			.not()
			.isString(),
		body('venueAetheryte')
			.escape()
			.notEmpty()
			.isString(),
		body('venueWebsite')
			.escape()
			.isString(),
		body('venueType1')
			.escape()
			.notEmpty()
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
		console.log('updateVenue POST received', req.body);

		const cookieAuth = auth.init(req);
		const userIdAuth =  cookieAuth ? cookieAuth['userId'] : null;

		if (userIdAuth !== req.body.userId) {
			res.redirect('/profile');
			return;
		}

		// make sure following is not empty
		if (
			!req.body.venueId
			&& !req.body.venueWorld
			&& !req.body.venueLocation
			&& !req.body.venueWard
			&& !req.body.venuePlot
			&& !req.body.venueType1
		) {
			res.status(400).send({ success: false });
			return;
		}

		const venueObject = {
			venueId: req.body.venueId,
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
		dbQuery.updateVenueByVenueId (venueObject);
		res.status(200).send({ success: true });

	});

	app.delete('/deleteVenue', [
		body('venueId')
			.escape()
			.not()
			.isString(),
		body('userId')
			.escape()
			.not()
			.isString(),
	], (req, res) => {
		console.log('deleteEvent DELETE received', req.body);

		const cookieAuth = auth.init(req);
		const userIdAuth =  cookieAuth ? cookieAuth['userId'] : null;

		if (userIdAuth !== req.body.userId) {
			res.redirect('/profile');
			return;
		}

		// make sure following is not empty
		if (!req.body.userId && !req.body.venueid) {
			res.status(400).send({ success: false });
			return;
		}

		const eventObject = {
			venueId: req.body.venueId,
			userId: req.body.userId,
		}
		dbQuery.deleteVenueByVenueId(eventObject);
		res.status(200).send({ success: true })
	});

}
