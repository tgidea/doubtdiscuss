const mongoose = require('mongoose');
const expSchema2 = new mongoose.Schema({
    title: String,
    title: String,
    opt1: {
        type: Number,
        default: 0
    },
    opt2: {
        type: Number,
        default: 0
    },
    opt3: {
        type: Number,
        default: 0
    },
    opt4: {
        type: Number,
        default: 0
    }
});
module.exports=expSchema2;