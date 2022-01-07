
const Register = require('../registerSchema')
const transporter = require('../functionality/nodemailer');
const registerFun = async (req, res) => {
    try {
        const username = req.body.username.toString().toLowerCase();
        const email = req.body.email;
        const name = req.body.name;
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
                            <p>Please link <a href="https://doubthelpertester.herokuapp.com/verify?id=${id}&name=${name} ">here</a> to verify your email.</p>
                            `
                };
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
                return "success";
            }
            catch (err) {
                console.log('error in registerFun');
                if (err.code == 11000) {
                    const det = await Register.find({ email });
                    if (det.length > 0) {
                        res.send({ "result": `Email already registered. If not verified , please check your mail inbox history or <a href="/outverify?email=${email}&username=${username}">verify </a> again` });
                    }
                    else {

                        if (err.keyValue.email != undefined) {
                            res.send({ "result": `Email already registered. If not verified , please check your mail inbox history or <a href="/outverify?email=${email}&username=${username}">verify </a> again` });
                        }
                        else if (err.keyValue.username != undefined) {
                            res.send({ "result": `Username already registered.` });
                        }
                        else {
                            res.send({ "result": `Please fill carefully` });
                        }
                    }
                }
                else {
                    res.send({ "result": "Please fill carefully" });
                }
                return "fail";
            }
        }
        if (username == "" || name == "" || email == "" || password.length < 5 || name.length < 2) {
            return res.json({ "result": "Please fill carefully" });
        }
        // console.log(username.indexOf('/'), username.indexOf('?'), username.indexOf('&'));
        if (username.indexOf('/') > -1 || username.indexOf('?') > -1 || username.indexOf('&') > -1) {
            return res.json({ "result": "Please don't use characters like /?&" });
        }
        if (password === confirmPassword) {
            const response = await createDocument();
            if (response == "success") {
                res.send({ "result": "Please check your inbox and verify your email " })
            }
        }
        else {
            res.send({ "result": "Password not match" });
        }

    }
    catch (err) {
        console.log(err);
        console.log('Error in processing /register');
        res.status(500).send({ "result": "Something went wrong" });
    }
}
module.exports = registerFun;