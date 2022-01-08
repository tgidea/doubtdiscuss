const jwt=require('jsonwebtoken');
const Register=require('../schema/registerSchema');
const Client = require('../schema/usernewkey');
const blockReq = require('../schema/blockReqschema');

const authlogout=async(req,res,next)=>{
    try{
        const token=req.cookies.jwt;
        const verifyToken=jwt.verify(token,process.env.JWT_TOKEN);
        const user =await Register.findOne({_id:verifyToken.id});
        req.user=user;
        next();
    }
    catch(err){
        console.log('Token not present or faulty 2');
        res.status(400).render('error',{"error":`Logout fails.`});
        // res.status(500).send(`<h1>Logout fails. Please <a href="/">Login</a></h1>`);
    }
}
module.exports=authlogout;