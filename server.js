//Express is a webframework package for node
//https://www.npmjs.com/package/express
//https://expressjs.com/
const express           = require('express');
const MongoClient       = require('mongodb');
const bodyParser        = require('body-parser');
const db                = require('./config/db');

const app               = express();

const port = 8081;

app.use(bodyParser.urlencoded( { extended: true }));

app.use(bodyParser.json());

MongoClient.connect(db.url, (err, database) => {
    if (err) return console.log(err);
    require('./app/routes')(app, database);

    database.collection("truckCounts")
        .ensureIndex({loc:"2dsphere"}, (error, result) => {
            if (error)
                console.log(error);
        });

    app.listen(port, () => {
        console.log('We are live on ' + port);
    });

});
