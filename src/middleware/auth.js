const jwt=require('jsonwebtoken');
const Register=require('../registerSchema');
// require('dotenv').config({ path: __dirname + '../config.env' });
// const JWT_KEY=process.env.JWT_KEY;


const auth=async(req,res,next)=>{
    try{
        const token=req.cookies.jwt;
        // console.log(token);
        const verifyToken=jwt.verify(token,process.env.JWT_TOKEN);
        // const user =await Register.findOne({_id:verifyToken.id});
        req.username=verifyToken.username;
        next();
    }
    catch(err){
        console.log('Token not present or faulty');
        res.status(201).send({"result":`Please <a href="/" style="text-decoration:none;color:rgb(248, 9, 109)">Sign In</a>`});
    }
}
module.exports=auth;