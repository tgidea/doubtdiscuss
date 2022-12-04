
const Register = require('../schema/registerSchema');

const loginFun = async (req,res) => {
    try {
        if (req.body.email == undefined || req.body.password == undefined) {
            return res.send({ "result": "Invalid login details" });
        }
        const email = req.body.email;
        const password = req.body.password.toString();
        //const Temp = Register.find({"email":email}) or 
        const Temp = await Register.findOne({ "email": email })
        if (Temp == undefined) {
            res.send({ "result": "Invalid login details" });
        }
        else if (Temp.password == password) {
            if (Temp.active == true) {
                const token = await Temp.generateAuthToken();
                // console.log(token);
                res.cookie("jwt", token, {
                    expires: new Date(Date.now() + 32400000000),
                    httpOnly: true
                })
                    // res.status(201).sendFile(path.join(staticPath, 'main.html'));
                    .redirect('/main')
            }
            else {
                res.send({ "result": "Invalid login details" });
            }
        }
        else {
            res.send({ "result": "Invalid login details" });
        }
    }
    catch (err) {
        console.log('Error occur in /login');
        console.log(err);
        res.send({ "result": "Invalid login details" });
    }
}

module.exports=loginFun;