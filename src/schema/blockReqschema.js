const mongoose = require('mongoose');
const blockReq = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    id: String,
    count: Number,
    data: {
        type: Date,
        default: Date.now
    }
});
module.exports = blockReq;