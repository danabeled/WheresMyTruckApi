const mongoose = require('mongoose');

const TruckSchema = new mongoose.Schema({
    name: String, 
    loc: {
        type: {type: String},
        coordinates: Array
    },
    here: Number,
    notHere: Number
});

TruckSchema.methods.findNearByTruck = function(truckName, latitude, longitude){
    this.findOne(truckCondition(truckName, latitude, longitude), (err, findRes) => {
        resolve(findRes);
    });
}
function truckCondition(truckName, latitude, longitude) {
    return {
        name: {$regex : truckName, $options: 'i'},
        loc: { 
            $near : {
                $geometry: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                },
                $maxDistance: 250,
                $minDistance: 0
            }
        }
    }
}
TruckSchema.index({ 'loc': '2dsphere'});    // This doesn't work as far as I 
                                            // can tell, there's an open bug on
                                            // stack overflow about indexing
                                            // 2dsphere locations so we'll go
                                            // back to this

module.exports = mongoose.model('trucks', TruckSchema);