const mongoose = require('mongoose');

const TruckSchema = new mongoose.Schema({
    name: String, 
    lat: String, 
    lon: String
});

module.exports = mongoose.model('trucks', TruckSchema);