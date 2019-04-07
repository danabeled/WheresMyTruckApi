const router = require('express').Router();
const Schedule = require('../../models/Schedule');

router.post('/add', (req, res) => {
    const schedule = { name: req.body.name, lat: req.body.lat, 
        lon: req.body.lon, day: req.body.day};
    if(schedule.day > -1 && schedule.day < 7){
        const newschedule = new Schedule(schedule);
        newschedule.save((err, result) => {
            if(err){
                res.send({'error' : 'An error has occurred' })
            } else {
                res.send(result);
            }
        });
    }
});

module.exports = router;