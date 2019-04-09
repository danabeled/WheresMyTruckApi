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

TruckSchema.index({ 'loc': '2dsphere'});    // This doesn't work as far as I 
                                            // can tell, there's an open bug on
                                            // stack overflow about indexing
                                            // 2dsphere locations so we'll go
                                            // back to this

module.exports = mongoose.model('trucks', TruckSchema);