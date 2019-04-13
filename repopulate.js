const MongoClient         = require('mongodb');
var schedule            = require("node-schedule");
const db                  = require('./config/db');

console.log("Starting repopulate script...")

var CronJob = require('cron').CronJob;
//second, minute, hour, day
var j = new CronJob('1 0 0 * * *', function() {
    MongoClient.connect(db.url, (err, database) => {
        if(err) console.log(err);
        var d = new Date();
        var todays = [];
        console.log(d.getDay());
        database.collection("trucks").drop(function(err, delOK) {
            if (err) console.log(err);
            if (delOK) {
                console.log("Truck Collection deleted");
                db.init();
            }
        });
        database.collection('scheduledTrucks').find({}).toArray(function(err, docs){
            docs.forEach(doc => {
                if(d.getDay() == doc.day){
                    todays.push(doc);
                    database.collection('trucks').insert(doc, (err, result) => {
                        if(err){
                            console.log({'error' : 'An error has occurred' })
                        } else {
                            console.log(result.ops[0]);
                        }
                    });
                }
            });
        });
    });
}, null, true, 'America/Boston');
console.log(j.nextDates());