const mongoose = require('mongoose');

const postSchema    =   new mongoose.Schema({
    postTitle       :   {type   :  String},
    postDesc        :   {type   :  String, required :   true},
    image           :   {type   :  String},
    tags            :   {type   :  Array,   default :   []},
    user            :   {type   :   String, required :  true, ref:'users'}
}, { 
    timestamps: true 
});

module.exports = mongoose.model('posts', postSchema);
