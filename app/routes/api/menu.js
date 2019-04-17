const router = require('express').Router();
const Menu = require('../../models/Menu');
router.post('/new', (req, res) => {
    var menu = new Menu(req.body);
    menu.save();
    res.send({'message' : 'New Menu Added'});
});

module.exports = router;