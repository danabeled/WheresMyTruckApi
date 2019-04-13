const db                  = require('./config/db');

console.log("Starting repopulate script...")

var CronJob = require('cron').CronJob;
//second, minute, hour, day
var j = new CronJob('1 0 0 * * *', function() {
    db.repopulate();
}, null, true, 'America/Boston');
console.log(j.nextDates());