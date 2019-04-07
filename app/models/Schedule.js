const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
    name: String, 
    lat: String, 
    lon: String,
    day: Number
});

module.exports = mongoose.model('scheduledTrucks', ScheduleSchema);