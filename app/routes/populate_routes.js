module.exports = function(app, db){
    app.get('/populate', (req, res) => {
        var d = new Date();
        var todays = [];
        console.log(d.getDay());
        db.collection("trucks").drop(function(err, delOK) {
            if (err) console.log(err);
            if (delOK) console.log("Truck Collection deleted");
        });
        db.collection("truckCounts").remove(function(err, delOK){
            if (err) console.log(err);
            if (delOK) console.log("Truck Count Collection deleted")
        });
        db.collection('scheduledTrucks').find({}).toArray(function(err, docs){
            docs.forEach(doc => {
                if(d.getDay() == doc.day){
                    todays.push(doc);
                    db.collection('trucks').insert(doc, (err, result) => {
                        if(err){
                            console.log({'error' : 'An error has occurred' })
                        } else {
                            console.log(result.ops[0]);
                        }
                    });
                }
            });
            res.send(todays);
        });
    });
};