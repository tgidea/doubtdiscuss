const mongoose = require('mongoose');

const idSchema = new mongoose.Schema({
    name: String,
    author:String,
    coAuthor:{
        type:String,
        default:""
    },
    access:{
        default:"",
        type:String
    },
    deniedTo:{
        type:String,
        default:""
    },
    limit:{
        type:Number,
        default:60
    },
    active:{
        type:Boolean,
        default:true
    }
    

});
const IdData = mongoose.model('iddatas', idSchema);
module.exports=IdData;

