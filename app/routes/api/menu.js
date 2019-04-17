const router = require('express').Router();
const Menu = require('../../models/Menu');
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

module.exports = router;