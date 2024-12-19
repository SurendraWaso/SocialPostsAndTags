const mongoose = require('mongoose');

const tagsSchema    =   new mongoose.Schema({
    name: { type: String, unique: true, required: true }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('tags', tagsSchema);