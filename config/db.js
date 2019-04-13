require('dotenv').config()
const MongoClient = require('mongodb');
const urlString = `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`
module.exports = {
    url : urlString,
    init : initialize,    
    repopulate : function(){ 
        MongoClient.connect(urlString, (err, database) => {
            if(err) console.log(err);
            var d = new Date();
            var todays = [];
            console.log(d.getDay());
            database.collection("trucks").drop(function(err, delOK) {
                if (err) console.log(err);
                if (delOK) {
                    console.log("Truck Collection deleted");
                    initialize();
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
    } 
};

function initialize(){
    MongoClient.connect(urlString, (err, database) => {
        if (err) return console.log(err);
        database.collection("trucks")
            .ensureIndex({loc:"2dsphere"}, (error, result) => {
                if (error)
                    console.log(error);
            });

    })
};