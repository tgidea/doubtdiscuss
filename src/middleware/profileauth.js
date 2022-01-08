const jwt = require('jsonwebtoken');
const Register = require('../schema/registerSchema');
const Client = require('../schema/usernewkey');
const blockReq = require('../schema/blockReqschema');

const profileAuth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        // console.log(token);
        const verifyToken = jwt.verify(token, process.env.JWT_TOKEN);
        const user = await Register.findOne({ _id: verifyToken.id });
        req.name = user.name;
        req.ids = "";
        req.email = user.email;
        req.username = verifyToken.username;
        try {
            const userinfo = await Client.findOne({ username: verifyToken.username });
            req.ids = userinfo.id;
        }
        catch (err) {
            console.log(err);
        }
        next();
    }
    catch (err) {
        // console.log(err);
        console.log('Token not present or faulty');
        res.status(404).redirect('./')
    }
}
module.exports = profileAuth;