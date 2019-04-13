require('dotenv').config()
const MongoClient = require('mongodb');
const urlString = `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`
module.exports = {
    url : urlString,
    init : function(){
        
        MongoClient.connect(urlString, (err, database) => {
            if (err) return console.log(err);
            database.collection("trucks")
                .ensureIndex({loc:"2dsphere"}, (error, result) => {
                    if (error)
                        console.log(error);
                });

        });
    }
};