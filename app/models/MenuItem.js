const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('menuitemss', MenuItemSchema);