const router = require('express').Router();
router.use('/trucks', require('./truck'));

module.exports = router;