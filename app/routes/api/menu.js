const router = require('express').Router();
const Menu = require('../../models/Menu');
const MenuItem = require('../../models/MenuItem');

router.post('/new', (req, res) => 
{
    Menu.findOne({truck: req.body.truck}, function(err, result){
        if(result == undefined){
            var menu = new Menu(req.body);
            menu.save();
            res.send({'message' : 'New Menu Added'});
        }
        else{
            res.status(400).send({'message' : 'Duplicate menu'});
        }
    });
});

router.post('/add', (req, res) =>
{
    Menu.findOne({truck: req.body.truck}, function(err, truck){
        truck.items.push(new MenuItem({'name' : req.body.item, 'price' : req.body.price}));
        truck.save();
        res.send({'message' : 'New Menu Item Added'});
    });
});

router.get('/all', (req, res) => {
    Menu.find({}, 'truck', function(err, menus){
        res.send(menus);
    });
});

module.exports = router;