const router = require('express').Router();

var deviceList = new Set();

router.post('/register', (req, res) => {
    var ip = req.body.ip;
    deviceList.add(ip);
    console.log(ip);
    res.send({"ip" : ip});
});

router.post('/remove', (req, res) => {
    var ip = req.body.ip;
    console.log(ip);
    deviceList.delete(ip);
    res.send({"ip" : ip});
});

module.exports.routes = router;
module.exports.list = deviceList;