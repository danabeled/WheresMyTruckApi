const router = require('express').Router();
const Menu = require('../../models/Menu');
const MenuItem = require('../../models/MenuItem');
const multer = require('multer');
const fs = require('fs');

var upload = multer({ dest: 'uploads/'});

router.post('/icon', upload.single('avatar'), function (req, res) {
    Menu.findOne({truck: req.body.truck}, function(err, result){
        if(result == undefined){
            res.status(400).send({'message' : 'Menu not found'});
        }
        else{
            Menu.updateOne({truck: req.body.truck},
                {
                    truck: result.truck,
                    img: {
                        data: fs.readFileSync(req.file.path),
                        contentType: 'image/png'

                    },
                    items: result.items
                });

                fs.unlink(req.file.path, function(){
                    console.log('Uploaded file delete');
                });
        };
        res.send({'message' : 'New Menu Icon Added'});
    })
});

router.post('/new', (req, res) => {
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

router.post('/add', (req, res) => {
    Menu.findOne({truck: req.body.truck}, function(err, truck){
        truck.items.push(new MenuItem({'name' : req.body.item, 'price' : req.body.price}));
        truck.save();
        res.send({'message' : 'New Menu Item Added'});
    });
});

router.get('/all', (req, res) => {
    Menu.find({}, function(err, menus){
        res.send(menus);
    });
});

module.exports = router;