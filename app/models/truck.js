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

TruckSchema.statics.findNearByTruck = function(truck){
    return new Promise((resolve, reject) => this.findOne(truckSearchCondition(truck), (err, findRes) => {
        resolve(findRes);
    }));
}

TruckSchema.statics.updateNearByTruck = function(truck){
    var options = { upsert:true };
    console.log(truck);
    return new Promise((resolve, reject) => this.updateOne(truckSearchCondition(truck), truck, options, (err, result) => {
        resolve(result);
    }));
}

function truckSearchCondition(truck) {
    return {
        name: {$regex : truck.name, $options: 'i'},
        loc: { 
            $near : {
                $geometry: {
                    type: "Point",
                    coordinates: [truck.loc.coordinates[0], truck.loc.coordinates[1]]
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