const Register = require('../schema/registerSchema')
const transporter = require('../functionality/nodemailer');
const registerFun = async (req, res) => {
    try {
        const username = req.body.username.toString().toLowerCase().trim();
        const email = req.body.email;
        const name = req.body.name.toLowerCase().trim();
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        const createDocument = async () => {
            const userinfor = new Register({
                "email": email,
                "username": username,
                "name": name,
                "password": password,
                "confirmPassword": confirmPassword,
            });
            try {
                const token = await userinfor.generateAuthToken();
                const result = await userinfor.save();
                const mailTo = userinfor.email;
                const name = userinfor.username;
                const id = userinfor._id;
                // console.log('result',result);
                var mailOptions = {
                    from: 'gyanexplode@gmail.com',
                    to: `${mailTo}`,
                    subject: 'Verify Account',
                    html: `<h2>Welcome ${name}</h2><h4> Thanks for using doubtHelper.</h4>
                            <p>Please link <a href="https://doubthelper.onrender.com/verify?id=${id}&name=${name} ">here</a> to verify your email.</p>
                            `
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        return res.status(200).send({ "result": "Email not sended. Something went wrong." });
                    } else {
                        console.log('Email sent: ' + info.response);
                        console.log(info);
                        return res.status(200).send({ "result": "Please check your inbox and verify your email" });
                    }
                });
                return;
            }
            catch (err) {
                console.log('already present username/email');
                if (err.code == 11000) {
                    const det = await Register.find({ email });
                    if (det.length > 0) {
                        res.status(400).send({ "result": `Email already registered. If not verified , please check your mail inbox history or <a href="/outverify?email=${email}&username=${username}">verify </a> again` });
                    }
                    else {

                        if (err.keyValue.email != undefined) {
                            res.status(400).send({ "result": `Email already registered. If not verified , please check your mail inbox history or <a href="/outverify?email=${email}&username=${username}">verify </a> again` });
                        }
                        else if (err.keyValue.username != undefined) {
                            res.status(400).send({ "result": `Username already registered.` });
                        }
                        else {
                            res.status(400).send({ "result": `Please fill carefully` });
                        }
                    }
                }
                else {
                    res.status(400).send({ "result": "Please fill carefully" });
                }
                return ;
            }
        }
        for (var i = 0, len = username.length; i < len; i++) {
            code = username.charCodeAt(i);
            if (!(code > 47 && code < 58) && // numeric (0-9)
              !(code > 64 && code < 91) && // upper alpha (A-Z)
              !(code > 96 && code < 123)) { // lower alpha (a-z)      
                return res.json({"result":"Please use alphanumeric only"});
            }
        }
        if (username == "" || name == "" || email == "" || password.length < 5 || name.length < 2) {
            return res.json({ "result": "Please fill carefully" });
        }
        if(username.indexOf(' ')>-1){
            return res.json({"result":"Space not allowed in username"})
        }
        // console.log(username.indexOf('/'), username.indexOf('?'), username.indexOf('&'));
        if (username.indexOf('/') > -1 || username.indexOf('?') > -1 || username.indexOf('&') > -1) {
            return res.json({ "result": "Please don't use characters like /?&" });
        }
        if (password === confirmPassword) {
            const response = await createDocument();
        }
        else {
            res.status(400).send({ "result": "Password not match" });
        }

    }
    catch (err) {
        console.log(err);
        console.log('Error in processing /register');
        res.status(400).send({ "result": "Something went wrong" });
    }
}
module.exports = registerFun;