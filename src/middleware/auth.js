const jwt=require('jsonwebtoken');
const Register=require('../registerSchema');
const Client = require('../schema/usernewkey');
const blockReq = require('../schema/blockReqschema');

const auth=async(req,res,next)=>{
    try{
        const token=req.cookies.jwt;
        const verifyToken=jwt.verify(token,process.env.JWT_TOKEN);
        const user =await Register.findOne({_id:verifyToken.id});
        req.email=user.email;
        req.username=verifyToken.username;
        // console.log(user);
        next();
    }
    catch(err){
        console.log('Token not present or faulty');
        res.status(201).send({"result":`Please <a href="/" style="color:rgb(248, 9, 109)">Sign In</a>`});
    }
}
module.exports=auth;