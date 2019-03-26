module.exports = function(app, db){
    app.post('/scheduledTrucks', (req, res) => {
        const schedule = { name: req.body.name, lat: req.body.lat, 
            lon: req.body.lon, day: req.body.day};
        if(schedule.day > -1 && schedule.day < 7){
            db.collection('scheduledTrucks').insert(schedule, (err, result) => {
                if(err){
                    res.send({'error' : 'An error has occurred' })
                } else {
                    res.send(result.ops[0]);
                }
            });
        }
    });
}