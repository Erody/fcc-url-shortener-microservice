const express = require('express');
const mongodb = require('mongodb');
const crypto = require('crypto');
const validUrl = require('valid-url');

const port = process.env.PORT || 3000;
const url = 'mongodb://localhost:27017/url_shortener';

const MongoClient = mongodb.MongoClient;
const app = express();

MongoClient.connect(url, (err, db) => {
	if(err) throw err;

	const collection = db.collection('urls');

	app.get('/', (req, res) => {
		res.send('Pass a valid url to /new/ to receive a shortened url.');
	});

	app.get('/:url', (req, res) => {
		const shortened = req.params.url;
		collection.findOne({shortened}, (err, item) => {
			if(err) throw err;
			if(item){
				return res.redirect(item.originalUrl);
			} else {
				res.json({error: 'Incorrect shortened URL.'})
			}
		});
	});

	app.get('/new/*', (req, res) => {
		const originalUrl = req.params[0];

		if(validUrl.isWebUri(originalUrl)) {
			const shortened = generateShortUrl();
			const shortenedUrl = `${req.protocol}://${req.get('host')}/${shortened}`;
			res.json({originalUrl, shortenedUrl});
			collection.update({ originalUrl }, { originalUrl, shortenedUrl, shortened }, { upsert: true })
		} else {
			res.json({error: 'Invalid URL.'});
		}

	});


});


function generateShortUrl() {
	return crypto.randomBytes(3).toString('hex');
}


app.listen(port, () => {
	console.log(`listening on port ${port}`)
});