const router = require('express').Router();
router.use('/trucks', require('./truck'));
router.use('/schedule', require('./schedule'));

module.exports = router;