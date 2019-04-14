const router = require('express').Router();
const Trucks = require('../../models/Truck');

router.post('/new', (req, res) =>{
    console.log(parseFloat(req.body.lat));
    const truck = { name: req.body.name, 
        loc: {
            type: "Point",
            coordinates: [parseFloat(req.body.lon), parseFloat(req.body.lat)],
        },
        here: 0,
        notHere: 0
    };
    
    const newTruck = new Trucks(truck);
    
    return newTruck.save(function(error){
        if(error) {
            res.send({'error' : error })
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
