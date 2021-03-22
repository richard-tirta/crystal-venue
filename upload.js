const { json } = require('express');

exports.init = function (req, res) {

	const app = require('./app.js');
	const AWS = require('aws-sdk');
	const doteenv = require('dotenv');
	const express = require('express');
	const fs = require('fs');
	const fileType = require('file-type');
	const multiparty = require('multiparty');
	const Pool = require('pg').Pool;
	const sharp = require('sharp');

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
    
	AWS.config.update({
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
	});

	app.use(express.urlencoded({ extended: true }));
	app.use(express.json());

	const s3 = new AWS.S3();

	const uploadFile = (buffer, name, type) => {
		const params = {
			ACL: 'public-read',
			Body: buffer,
			Bucket: 'crystal-venue-association',
			ContentType: type.mime,
			Key: `${name}.${type.ext}`,
		};
		return s3.upload(params).promise();
	};

	app.post('/uploadVenuePic', (request, response) => {
		const form = new multiparty.Form();
		form.parse(request, async (error, fields, files) => {
			console.log('hmmmmm', fields, files);
			if (error) {
				return response.status(500).send(error);
			};
			try {
				const path = files.file[0].path;
				const buffer = fs.readFileSync(path);
				const type = await fileType.fromBuffer(buffer);
				const fileName = `venueImage/${Date.now().toString()}`;
				const data = await uploadFile(buffer, fileName, type);

				const venueId = parseInt(fields.id);

				pool.query(
					'UPDATE venues SET image = $1 WHERE id = $2',
					[data.Location, venueId],
					(error, results) => {
						if (error) {
							throw error
						}
						console.log('Users venue is updated with new image');
					}
				)

				return response.status(200).send(data);
			} catch (err) {
				console.log('uploadVenuePic fail', err)
				return response.status(500).send(err);
			}
		});
	});

	app.post('/uploadEventPic', (request, response) => {
		const form = new multiparty.Form();
		form.parse(request, async (error, fields, files) => {
			//onsole.log('hmmmmm', fields, files);
			if (error) {
				return response.status(500).send(error);
			};
			try {
				const path = files.file[0].path;
				//const buffer = fs.readFileSync(path);
				const thumbnailImg = await sharp(path).resize(832).webp().toBuffer();
				const type = await fileType.fromBuffer(thumbnailImg);
				const eventId = parseInt(fields.id);
				const fileName = `eventImage/${eventId}_${Date.now().toString()}_thumbnail`;
				const data = await uploadFile(thumbnailImg, fileName, type);

				pool.query(
					'UPDATE events SET image = $1 WHERE id = $2',
					[data.Location, eventId],
					(error, results) => {
						if (error) {
							throw error
						}
						console.log('Users event is updated with new image');
					}
				)

				return response.status(200).send(data);
			} catch (err) {
				console.log('uploadEventPic fail', err)
				return response.status(500).send(err);
			}
		});
	});

}
