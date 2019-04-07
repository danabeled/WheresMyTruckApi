var deviceList = new Set();
var admin = require('firebase-admin');
var fs = require('fs');

var serviceAccount = require("../../firebaseServiceAccountCredentials.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wheresmytruck-1536879566167.firebaseio.com"
  });

function sendMessage(truck, messageType) {
    
    console.log(truck);
    for (let device of deviceList.values()) {
        console.log(device);
        var message = {
            data : {
                truck_message_type : messageType,
                truck_name: truck.name,
                truck_lat: String(truck.loc.coordinates[1]),
                truck_lon: String(truck.loc.coordinates[0]),
                truck_here: String(truck.here),
                truck_not_here: String(truck.notHere)
            },
            token : device
        };
        admin.messaging().send(message)
            .then((response) => {
                console.log('success');
            })
            .catch((error) => {
                console.log('error', error);
            })
        }
}

function pushToSubscribers(truck, hereIncrement, notHereIncrement) {
    console.log("push to subscribers");

    if (hereIncrement > 0) {
        
        // new trucks and
        // trucks that just broke visibility threshold
        // should be sent as push notification
        if ((truck.notHere < 5 && truck.here == 5)
            || (truck.notHere > 5 && truck.here / truck.notHere > 1 && (truck.here - hereIncrement) / truck.notHere <= 1)) {
            
            sendMessage(truck, "add");
        }
    }
    if (notHereIncrement > 0) {
        console.log("notHere");
        // trucks that just fell under visibility threshold
        // should be sent as push notification
        if (truck.notHere > 5 && truck.here / truck.notHere <= 1 
            && (truck.here / (truck.notHere - notHereIncrement) > 1 || truck.notHere == 6)) {
                
                sendMessage(truck, "remove");
            }
    }
}

module.exports = function(app, db) {

    app.post('/register', (req, res) => {
        var ip = req.body.ip;
        deviceList.add(ip);
        console.log(ip);
        res.send({"ip" : ip});
    });

    app.post('/remove', (req, res) => {
        var ip = req.body.ip;
        console.log(ip);
        deviceList.delete(ip);
        res.send({"ip" : ip});
    });
    
    app.get('/truckCounts', (req, res) => {
        var truck = {name : req.query.name};
        db.collection('truckCounts').find({name:truck.name}).toArray(function(err, docs){
            res.send(docs);
        });
    });

    
    app.get('/truckAllCounts', (req, res) => {
        db.collection('truckCounts').find({}).toArray(function(err, docs){
            res.send(docs);
        });
    });



    function truckCondition(truckName, latitude, longitude) {
        return {
            name: {$regex : truckName, $options: 'i'},
            loc: { 
                $near : {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: 250,
                    $minDistance: 0
                }
            }
        }
    }
    
    function truckMatchCount(condition) {
        return new Promise((resolve, reject) => {
            db.collection('truckCounts')
            .count(condition, (err, count) => {
                resolve(count);
            });
        });
    }

    function getTruck(condition) {
        return new Promise((resolve, reject) => {
            db.collection('truckCounts').findOne(condition, (err, findRes) => {
                    resolve(findRes);
                });
            });       
    }
    
    function updateTruckCounts(truck, condition, res) {
        var options = { upsert:true };

        db.collection('truckCounts').update(condition, truck, options, (err, result) => {
            if (err) {
                console.log(err);
                res.send({'error' : 'truck upsert error'});
            } else {
                var formattedTruck = {
                    name: truck.name,
                    lat: String(truck.loc.coordinates[1]),
                    lon: String(truck.loc.coordinates[0]),
                    here: String(truck.here),
                    notHere: String(truck.notHere)
                }
                res.send(formattedTruck);
            }
        });
    }

    function handleTruckVotes(truck, condition, hereIncrement, notHereIncrement, res) {
        var truckCountPromise = truckMatchCount(condition);
        truckCountPromise.then(count => {
            if (count > 0) {
                var truckPromise = getTruck(condition);
                truckPromise.then(result => {
                    truck.here = result.here + hereIncrement;
                    truck.notHere = result.notHere + notHereIncrement;
                    updateTruckCounts(truck, condition, res);
                    try {
                        pushToSubscribers(truck, hereIncrement, notHereIncrement);
                    } catch(err) {
                        console.log(err);
                    }
                }).catch(err => {
                    console.log(err);
                })
            } else {
                truck.here = hereIncrement;
                truck.notHere = notHereIncrement;
                updateTruckCounts(truck, condition, res);
            }
        }).catch(err => {
            console.log(err);
        });
    }
    
    app.post('/trucks/here', (req, res) => {
        truck = { 
            name : req.body.name,
            loc: {
                type: "Point",
                coordinates: [parseFloat(req.body.lon), parseFloat(req.body.lat)]
            }
        }
        var condition = truckCondition(req.body.name, parseFloat(req.body.lat), parseFloat(req.body.lon));
        handleTruckVotes(truck, condition, 1, 0, res);
    });

    app.post('/trucks/nothere', (req, res) => {
        truck = { 
            name : req.body.name,
            loc: {
                type: "Point",
                coordinates: [parseFloat(req.body.lon), parseFloat(req.body.lat)]
            }
        }
        var condition = truckCondition(req.body.name, parseFloat(req.body.lat), parseFloat(req.body.lon));
        handleTruckVotes(truck, condition, 0, 1, res);
    });
};