const mongoose = require('mongoose');
const blockReq = new mongoose.Schema({
    ip: String,
    id: String,
    count: Number,
    data: {
        type: Date,
        default: Date.now
    }
});
module.exports=blockReq;