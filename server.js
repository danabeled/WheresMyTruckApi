//Express is a webframework package for node
//https://www.npmjs.com/package/express
//https://expressjs.com/
const express           = require('express');
const bodyParser        = require('body-parser');
const db                = require('./config/db');

const app               = express();

const port = 8081;

app.use(bodyParser.urlencoded( { extended: true }));
app.use(bodyParser.json());
app.use(require("cors")());

const mongoose = require("mongoose");
mongoose.connect(db.url, {useNewUrlParser: true}).then(
    () => { console.log(`${new Date().toUTCString()} - Successfully connected to MongoDB.`) },
    err => { console.log(`${new Date().toUTCString()} - Failed to connect to MongoDB. ${err.stack}`) }
);

db.init();

app.use(require('./app/routes'));
app.listen(port, () => {
    console.log('We are live on ' + port);
});