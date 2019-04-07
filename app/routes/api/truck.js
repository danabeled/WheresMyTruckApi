const router = require('express').Router();
const Trucks = require('../../models/Truck');

router.post('/new', (req, res) =>{
    const truck = { name: req.body.name, lat: req.body.lat, lon: req.body.lon };
    
    console.log('trucks');

    const newTruck = new Trucks(truck);
    return newTruck.save(function(error){
        if(error) {
            res.send({'error' : 'An error has occurred' })
        } else {
            res.send(newTruck);
        }
    })    
});

router.get('/all', (req, res) => {
    Trucks.find({},function(err, docs){
        res.send(docs);
    });
});

module.exports = router;
