const mongoose = require('mongoose')
const blockReq = new mongoose.Schema({
    username:{
        type:String,
        unique:true  
      },
    id: String,
    count: Number,
    data: {
        type: Date,
        default: Date.now
    }
});
const Client = mongoose.model('user1ids', blockReq);
module.exports=Client;