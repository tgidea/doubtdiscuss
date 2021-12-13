const jwt=require('jsonwebtoken');
const Register=require('../registerSchema');
const path = require('path');
const staticPath = path.join(__dirname, '.../public');
const authpage=async(req,res,next)=>{
    try{
        const token=req.cookies.jwt;
        const verifyToken=jwt.verify(token,process.env.JWT_TOKEN);
        // console.log(veriftToken);
        const user =await Register.findOne({_id:verifyToken.id});
        req.username=verifyToken.username;
        next();
    }
    catch(err){
        console.log('Token not present or faulty');
        res.status(201).render('page', { name:"" ,link:"/",username:"Login"  });
    }
}
module.exports=authpage;