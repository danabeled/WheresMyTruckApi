const truckRoutes = require('./truck_routes');
const scheduleRoutes = require('./schedule_routes');
const observer = require('./observer');

///*
const router = require('express').Router();
router.use('/api', require('./api'));
module.exports = router;
//*/

/*
module.exports = function(app, db){
        // Add headers
    app.use(function (req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);

        // Pass to next layer of middleware
        next();
    });

    truckRoutes(app, db);
    scheduleRoutes(app, db);
    observer(app, db);
}
//*/
