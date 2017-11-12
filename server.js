const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const routesAPI = require('./app/routes');
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const config = require('./config');

const app = express();
const port = (process.env.PORT || config.port);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use('/', express.static(path.resolve(__dirname, 'dist')));

MongoClient.connect(config.dbAddress, (err, db) => {
	if (err) {
		console.error(err);
		return;
	}
	console.log('Connected correctly to server');
	routesAPI(app, db);
	app.use('*', express.static(path.resolve(__dirname, 'dist', 'index.html')));
	app.listen(port, () => {
		console.log(`Server start on ${port} port`);
	});
});
