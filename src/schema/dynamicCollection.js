const mongoose = require('mongoose')
const dynamicSchema = (prefix)=> {
    const expSchema = new mongoose.Schema({
        title: String,
        owner:String,
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
    mongoose.model(prefix+"",expSchema,prefix);

}
module.exports=dynamicSchema