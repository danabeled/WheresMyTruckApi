const mongoose = require('mongoose');

const MenuItem = require('./MenuItem')


const MenuSchema = new mongoose.Schema({
    truck: {
        type: String,
        required: true
    },
    items: [MenuItem.schema]
});


module.exports = mongoose.model('menus', MenuSchema);