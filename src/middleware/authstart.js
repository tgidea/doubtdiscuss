const jwt=require('jsonwebtoken');
const Register=require('../schema/registerSchema');
const path = require('path');
const envPath = path.join(__dirname, '../config.env');
require('dotenv').config({ path: envPath });
const JWT_TOKEN=process.env.JWT_TOKEN;
// console.log(JWT_TOKEN);
const authstart=async(req,res,next)=>{
    try{
        const token=req.cookies.jwt;
        const verifyToken=jwt.verify(token,process.env.JWT_TOKEN);
        // console.log(verifyToken);
        const user =await Register.findOne({_id:verifyToken.id});
        req.useremail=user.email;
        req.username=verifyToken.username;
        req.user=user.username;
        next();
    }
    catch(err){
        console.log('Token not present or faulty5',err);
        res.status(201).render('main',{username:"Login",link:"/"});
    }
}
module.exports=authstart;