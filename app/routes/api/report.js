var admin = require('firebase-admin');
var serviceAccount = require("../../../firebaseServiceAccountCredentials.json");
var devices = require("./devices");
const Trucks = require('../../models/Truck');
const router = require('express').Router();

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://wheresmytruck-1536879566167.firebaseio.com"
  });

function sendMessage(truck, messageType) {
    
    for (let device of devices.list.values()) {
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

router.get('/truckCounts', (req, res) => {
    var truck = {name : req.query.name};
    Trucks.find({name:truck.name}).toArray(function(err, docs){
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

function getTruck(condition) {
    return new Promise((resolve, reject) => {
        Trucks.findOne(condition, (err, findRes) => {
                resolve(findRes);
            });
        });       
}

function updateTruckCounts(truck, condition, res) {
    var options = { upsert:true };

    Trucks.updateOne(condition, truck, options, (err, result) => {
        if (err) {
            console.log(err);
            res.status(400).send({'error' : 'truck upsert error'});
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

    console.log('handle truck votes');
    console.log(condition);
    Trucks.find(condition, (err, items) => {
        if (items != null && items.length > 0) {
            
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
    });
}

router.post('/here', (req, res) => {
    truck = { 
        name : req.body.name,
        loc: {
            type: "Point",
            coordinates: [parseFloat(req.body.lon), parseFloat(req.body.lat)]
        }
    }
    console.log(truck.loc.coordinates.length);
    if(req.body.lat == null || req.body.lon == null)
        return res.status(400).send();
    var condition = truckCondition(req.body.name, parseFloat(req.body.lat), parseFloat(req.body.lon));
    handleTruckVotes(truck, condition, 1, 0, res);
});

router.post('/nothere', (req, res) => {
    truck = { 
        name : req.body.name,
        loc: {
            type: "Point",
            coordinates: [parseFloat(req.body.lon), parseFloat(req.body.lat)]
        }
    }
    if(req.body.lat == null || req.body.lon == null)
        return res.status(400).send();
    var condition = truckCondition(req.body.name, parseFloat(req.body.lat), parseFloat(req.body.lon));
    handleTruckVotes(truck, condition, 0, 1, res);
});

module.exports = router;