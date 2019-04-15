const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
    truck: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('menus', MenuSchema);