const router = require('express').Router();
router.use('/trucks', require('./truck'));
router.use('/schedule', require('./schedule'));
router.use('/report', require('./report'));

module.exports = router;