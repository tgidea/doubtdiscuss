const mongoose = require('mongoose')
const jwt=require('jsonwebtoken');
require('dotenv').config({ path: __dirname + '/config.env' });
const JWT_KEY=process.env.JWT_TOKEN;
const register = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmPassword:{
        type:String,
        required:true
    },
    active:{
        type:Boolean,
        default:false
    },
    tokens:[{
        token1:{
        type:String,
        required:true
        }
    }]
})
register.methods.generateAuthToken= async function(){
    try{
        const token=jwt.sign({id:this._id.toString(),username:this.username.toString()},`${JWT_KEY}`);
        this.tokens=({token1:token});
        await this.save();
        // console.log(token);
        return token;
    }
    catch(err){
        console.log('Error in registerschema');
    }
}
const Register = new mongoose.model("registers",register);
module.exports=Register;