const express = require('express');
const mongodb = require('mongodb');
const crypto = require('crypto');

const port = process.env.PORT || 3000;
const url = 'mongodb://localhost:27017/url_shortener';

const MongoClient = mongodb.MongoClient;
const app = express();

MongoClient.connect(url, (err, db) => {
	if(err) throw err;

	app.get('/', (req, res) => {
		res.send('Pass a valid url to /new/ to receive a shortened url.');
	});

	app.get('/:url', (req, res) => {
		// check db for shortened url
			// if url is found redirect to the original url
			// if url is not found respond with json(err)
	});

	app.get('/new/*', (req, res) => {
		const originalUrl = req.params[0];
		const shortened = generateShortUrl();
		const shortenedUrl = `${req.protocol}://${req.get('host')}/${shortened}`;
		res.json({originalUrl, shortenedUrl})
	});

	db.close();
});


function generateShortUrl() {
	return crypto.randomBytes(3).toString('hex');
}


app.listen(port, () => {
	console.log(`listening on port ${port}`)
});